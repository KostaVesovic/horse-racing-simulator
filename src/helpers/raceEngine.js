// Initializes lane runtime state for a given round.
export const createRoundLaneStates = (round) => {
  if (!round) {
    return []
  }

  return round.horses.map((horse) => ({
    horse,
    distanceCovered: 0,
    progress: 0,
    finishPosition: null
  }))
}

// Applies finish positions from lane state back into the round model.
export const finalizeRoundWithPlacements = (round, laneStates) => {
  const finishPositionByHorseId = new Map(
    laneStates.map((lane) => [lane.horse.id, lane.finishPosition])
  )

  return {
    ...round,
    isCompleted: true,
    horses: round.horses.map((horse) => ({
      ...horse,
      finishPosition: finishPositionByHorseId.get(horse.id) ?? null
    }))
  }
}

// Runs one tick of lane progression and reports completion state.
export const advanceRoundTick = (laneStates, roundDistance) => {
  let nextFinishPosition = laneStates.filter(
    (lane) => lane.finishPosition !== null
  ).length

  const updatedLaneStates = laneStates.map((lane) => {
    const nextDistance = Math.min(
      lane.distanceCovered + lane.horse.condition,
      roundDistance
    )
    const hasFinished = lane.finishPosition !== null
    const justFinished = !hasFinished && nextDistance >= roundDistance

    if (justFinished) {
      nextFinishPosition += 1
    }

    return {
      ...lane,
      distanceCovered: nextDistance,
      progress: nextDistance / roundDistance,
      finishPosition: justFinished ? nextFinishPosition : lane.finishPosition
    }
  })

  const allFinished = updatedLaneStates.every((lane) => lane.progress >= 1)

  return {
    updatedLaneStates,
    allFinished
  }
}

// Clears completion fields so a schedule can be replayed.
export const resetScheduleRoundResults = (rounds) => {
  return rounds.map((round) => ({
    ...round,
    isCompleted: false,
    horses: round.horses.map((horse) => ({
      ...horse,
      finishPosition: null
    }))
  }))
}
