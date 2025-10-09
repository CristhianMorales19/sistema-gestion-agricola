export interface CrewMember {
    id: string;
    name: string;
    identification: string;
}

export interface CreateCrewData {
    code: string;
    description: string;
    workers: string[]; // Array of employee IDs
}

export interface Crew {
    id: string;
    description: string;
    workArea: string;
    active: boolean;
    code: string;
    workers: CrewMember[];
}

export interface CrewApiResponse {
    id: string;
    description: string;
    workArea: string;
    active: boolean;
    code: string;
    workers: Array<{
        id: string;
        name: string;
        identification: string;
    }>;
}