import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Application`;

export interface Application {
    id: string;
    applicantName: string;
    policyType: string;
    premium: number;
    status: string;
    createdAt: string;
}

export const getAllApplications = async (): Promise<Application[]> => {
    const response = await axios.get<Application[]>(BASE_URL);
    return response.data;
};

export const getApplicationById = async (id: string): Promise<Application> => {
    const response = await axios.get<Application>(`${BASE_URL}/${id}`);
    return response.data;
};

export const createApplication = async (data: Omit<Application, 'id' | 'createdAt'>): Promise<Application> => {
    const response = await axios.post<Application>(BASE_URL, data);
    return response.data;
};