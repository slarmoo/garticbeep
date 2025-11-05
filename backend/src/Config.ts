export interface chain {
    chain: chainLink[],
    _id?: number
}

export interface chainLink {
    promptGiver: string,
    prompt?: string,
    songmaker?: string,
    song?: string,
    songName?: string
}

export interface user {
    user: string,
    onHold: boolean,
    strikes: number,
    profilePictureURL: string
}

export interface job {
    _id: number,
    isPrompt: boolean,
    promptOrUrl: string,
    timeOpened: number
}