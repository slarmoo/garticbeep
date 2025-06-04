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