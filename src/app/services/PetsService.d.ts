import { AxiosRequestConfig, AxiosPromise } from 'axios';

export interface Pet {
    _id: string,
    name: string,
    raca: string,
    createdAt: string,
    updatedAt:string,
    __v: number
};

type FecthAll = Array<Pets>;

declare class PetsService {

    api: AxiosRequestConfig;

    fetchAll(): Promise<AxiosPromise<FecthAll>>;

    fetchWithId(id: string): Promise<AxiosPromise<Pet>>;

    updateAt(pet: Pet): Promise<AxiosPromise<Pet>>;

    create(pet: Pet): Promise<AxiosPromise<Pet>>;

    remove(id: string): Promise<AxiosPromise<String>>;

}

export default PetsService;