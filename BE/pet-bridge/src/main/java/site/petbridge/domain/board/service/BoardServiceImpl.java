package site.petbridge.domain.board.service;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import site.petbridge.domain.board.domain.Board;
import site.petbridge.domain.board.domain.enums.BoardType;
import site.petbridge.domain.board.dto.request.BoardEditRequestDto;
import site.petbridge.domain.board.dto.request.BoardRegistRequestDto;
import site.petbridge.domain.board.dto.response.BoardResponseDto;
import site.petbridge.domain.board.repository.BoardRepository;
import site.petbridge.domain.user.domain.User;
import site.petbridge.global.exception.ErrorCode;
import site.petbridge.global.exception.PetBridgeException;
import site.petbridge.util.AuthUtil;
import site.petbridge.util.S3FileUtil;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final AuthUtil authUtil;
    private final S3FileUtil fileUtil;

    /**
     * 게시글 등록
     */
    @Transactional
    @Override
    public void registBoard(BoardRegistRequestDto boardRegistRequestDto, MultipartFile thumbnailFile) throws Exception {
        // null 입력 처리
        if (boardRegistRequestDto.getType() == null || boardRegistRequestDto.getTitle() == null
                || boardRegistRequestDto.getContent() == null) {
            throw new PetBridgeException(ErrorCode.BAD_REQUEST);
        }

        User user = authUtil.getAuthenticatedUser();

        String savedThumbnailFileName = null;
        if (thumbnailFile != null) {
            savedThumbnailFileName = fileUtil.saveFile(thumbnailFile, "images");
        }

        Board entity = boardRegistRequestDto.toEntity(user.getId(),savedThumbnailFileName);
        boardRepository.save(entity);
    }

    /**
     * 게시글 목록 조회
     */
    @Override
    public Page<BoardResponseDto> getListBoard(int page, int size, String userNickname, String title, BoardType type) throws Exception {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return boardRepository.findAllByUserNickNameAndTypeAndTitleContains(userNickname, title, type, pageable);
    }

    /**
     * 실종 동물 게시판 위치 기반 목록 검색
     */
    @Override
    public Page<BoardResponseDto> getListLostBoardByLocation(int page, int size, double lat, double lon) throws Exception {
        List<BoardResponseDto> boards = boardRepository.findAllByLocationFiltering(lat, lon);

        // 거리 계산 및 정렬
        boards.forEach(board -> {
            double distance = calculateDistance(lat, lon, Double.parseDouble(board.getLat()), Double.parseDouble(board.getLon()));
            board.setDistance(distance); // BoardResponseDto에 distance 필드를 추가해야 합니다.
        });

        // 거리 기준으로 정렬
        boards.sort(Comparator.comparingDouble(BoardResponseDto::getDistance));

        // 페이징 처리
        int start = (int) PageRequest.of(page, size).getOffset();
        int end = Math.min((start + PageRequest.of(page, size).getPageSize()), boards.size());
        List<BoardResponseDto> pagedBoards = boards.subList(start, end);

        return new PageImpl<>(pagedBoards, PageRequest.of(page, size), boards.size());
    }

    /**
     * 동물 id 에 따른 게시글 목록 조회
     */
    @Override
    public Page<BoardResponseDto> getListBoardByAnimalId(int page, int size, int animalId) throws Exception {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return boardRepository.findAllByAnimalIdAndDisabledFalse(animalId, pageable);
    }

    /**
     * 게시글 상세 조회
     */
    @Override
    public BoardResponseDto getDetailBoard(int id) throws Exception {
        BoardResponseDto boardResponseDto = boardRepository.getDetailBoardById(id);
        if (boardResponseDto == null) {
            throw new PetBridgeException(ErrorCode.RESOURCES_NOT_FOUND);
        }

        return boardResponseDto;
    }

    /**
     * 게시글 수정
     */
    @Transactional
    @Override
    public void editBoard(int id, BoardEditRequestDto boardEditRequestDto, MultipartFile thumbnailFile) throws Exception {
        // null 입력 처리
        if (boardEditRequestDto.getType() == null || boardEditRequestDto.getTitle() == null
                || boardEditRequestDto.getContent() == null) {
            throw new PetBridgeException(ErrorCode.BAD_REQUEST);
        }

        User user = authUtil.getAuthenticatedUser();

        // 없거나 삭제된 게시판 404
        Board entity = boardRepository.findByIdAndDisabledFalse(id)
            .orElseThrow(() -> new PetBridgeException(ErrorCode.RESOURCES_NOT_FOUND));
        // 내 게시판 아님 403
        if (entity.getUserId() != user.getId()) {
            throw new PetBridgeException(ErrorCode.FORBIDDEN);
        }
        
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) { // 이미지 파일 입력이 있을때만 entity 저장
            System.out.println("thumbnailFile 있음.");
            String savedThumbnailFileName = fileUtil.saveFile(thumbnailFile, "images");
            entity.setThumbnail(savedThumbnailFileName);
        }

        entity.update(boardEditRequestDto);
        boardRepository.save(entity);
    }

    /**
     * 게시글 삭제
     */
    @Transactional
    @Override
    public void removeBoard(int id) throws Exception {
        User user = authUtil.getAuthenticatedUser();

        // 없거나 삭제된 게시판 404
        Board entity = boardRepository.findByIdAndDisabledFalse(id)
            .orElseThrow(() -> new PetBridgeException(ErrorCode.RESOURCES_NOT_FOUND));
        // 내 게시판 아님 403
        if (entity.getUserId() != user.getId()) {
            throw new PetBridgeException(ErrorCode.FORBIDDEN);
        }
        // 파일 삭제는 현재 보류
        // if(entity.getThumbnail() != null && !entity.getThumbnail().isEmpty()){
        //     fileUtil.removeFile("images", entity.getThumbnail());
        // }

        entity.disable();
        boardRepository.save(entity);
    }

    /**
     * 글,그림 함께 작성을 위한 S3 파일 업로드 후, 경로 정보 return
     */
    @Override
    public String registImage(MultipartFile thumbnailFile) throws Exception {
        if (thumbnailFile == null || thumbnailFile.isEmpty()) {
            throw new PetBridgeException(ErrorCode.BAD_REQUEST);
        }
        String savedImageFileName = fileUtil.saveFile(thumbnailFile, "images");

        return savedImageFileName;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // 유클리드 거리 계산 또는 다른 거리 계산 공식 사용
        return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
    }
}