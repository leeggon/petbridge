// import StateBadge from "components/common/StateBadge"
import PetpickIconContainer from "./PetpickIconContainer"
// import React, {useState} from "react"

const AnimalInfo = ({animal}) => {
  return (
    <>
      <div className="flex flex-col space-y-1">
        <div className="text-base">{animal.name} </div>
        <div className="text-base">{animal.age} 년생</div>
        <div className="text-base">{animal.kindCd}</div>
      </div>
    </>
  )
}

const TaggedAnimalItem = ({animal, isFollowing, isLogin, onClick}) => {
  return (
    <div
      className="relative flex justify-between p-3"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick()
        }
      }}
    >
      <div className="flex space-x-3">
        <img
          src={animal.filename}
          className="h-60 w-40 object-contain"
          alt="animalImage"
        />

        <AnimalInfo animal={animal}></AnimalInfo>
        {/* <StateBadge state={animal.processState} /> */}
      </div>
      <div className="flex h-full flex-col justify-between">
        <PetpickIconContainer
          isFollowButton={true}
          isFollowing={isFollowing}
          animalId={animal.id}
          isLogin={isLogin}
        />
      </div>
    </div>
  )
}

export default TaggedAnimalItem
