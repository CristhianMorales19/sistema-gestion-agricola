export interface CrewMember {
    id: string;
    name: string;
    identification: string;
}

export interface CreateCrewData {
    code: string;
    description: string;
    workArea: string;
    workers: string[];
    [key: string]: unknown;
}

export interface Crew {
    id: string;
    description: string;
    workArea: string;
    active: boolean;
    code: string;
    workers: CrewMember[];
}
