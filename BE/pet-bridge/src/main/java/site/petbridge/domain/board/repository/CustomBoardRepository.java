package site.petbridge.domain.board.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import site.petbridge.domain.board.domain.enums.BoardType;
import site.petbridge.domain.board.dto.response.BoardResponseDto;

import java.util.List;

public interface CustomBoardRepository {
    Page<BoardResponseDto> findAllByUserNickNameAndTitleContains(String userNickName, String title, BoardType type, Pageable pageable);

    BoardResponseDto getDetailBoardById(int id);

    List<BoardResponseDto> findAllByAnimalIdAndDisabledFalse(int animalId);
}
