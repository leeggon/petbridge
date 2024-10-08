import React, {useEffect, useState} from "react"
import AnimalProfile from "./AnimalProfile"
import TaggedArticleItem from "../petpick/TaggedArticleItem"

const Popover = ({list, children, type, onSelectAnimal, onVisible}) => {
  const [visible, setVisible] = useState(false)
  const [selectedAnimalId, setSelectedAnimalId] = useState(null)

  const togglePopover = () => {
    setVisible((prev) => !prev)
    if (visible) {
      onVisible(true)
    } else {
      onVisible(false)
    }
  }

  useEffect(() => {
    // console.log("list", list)
  })
  const handleAnimalSelect = (id) => {
    if (visible) {
      setSelectedAnimalId(id)
      if (onSelectAnimal) {
        onSelectAnimal(id) // 선택된 동물 ID를 부모 컴포넌트로 전달
      }
      togglePopover()
    }
  }
  const ResetselectedAnimal = () => {
    setSelectedAnimalId(null)
    togglePopover()
    onSelectAnimal(null)
  }

  return (
    <div className="relative inline-block">
      <button
        className="p-2 transition duration-200 ease-in-out hover:scale-105 focus:outline-none"
        onClick={togglePopover}
      >
        {children}
      </button>
      <div
        className={`absolute left-0  top-12 z-40 mb-2 h-fit max-h-[400px] w-96 overflow-auto rounded-lg border border-gray-200 bg-white text-sm shadow-lg transition-transform duration-200 ease-in-out${
          visible
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <ul>
          <li>
            <button
              className="mx-4 my-2 h-12 w-11/12 rounded-md bg-gray-300 text-lg transition duration-150 hover:bg-gray-400"
              onClick={ResetselectedAnimal}
            >
              선택안함
            </button>
          </li>
          {list && list.length > 0 ? (
            list.map((item, index) => (
              <li
                key={index}
                className={`m-2 w-11/12 rounded-lg ${
                  type === "animal" && selectedAnimalId === item.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                } flex items-center transition duration-150`}
              >
                {type === "animal" ? (
                  <AnimalProfile
                    data={item}
                    isSelected={selectedAnimalId === item.id}
                    onSelect={() => handleAnimalSelect(item.id)}
                  />
                ) : (
                  <TaggedArticleItem
                    data={item}
                    onClick={() => handleAnimalSelect(item.id)}
                  />
                )}
              </li>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              {type === "animal"
                ? "등록된 동물이 없습니다. 동물을 등록해주세요."
                : "태그할 글이 없습니다. 글을 등록해주세요."}
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Popover
