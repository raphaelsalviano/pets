/* @flow */

import axios from 'axios';
import qs from 'qs';

import type { $AxiosXHR, $AxiosError } from 'axios';

export type Pet = {
    _id: string,
    name: string,
    raca: string,
    createdAt: string,
    updatedAt:string,
    __v: number
};

type ResponseError = {
    response: {
        data: any
    }
};

type FecthAll = Array<Pets>;

class PetsService {
    api: axios.create;

    endpointUrl: string;

    constructor() {
        // $FlowFixMe
        if (!PetsService.instance) {
            this.endpointUrl = 'https://pets-unipe.herokuapp.com/pets';
            this.api = axios.create({});
            this.api.interceptors.request.use(
                this.seralizeBeforeSend,
                this.seralizeBeforeSendError
            );
            this.api.interceptors.response.use(
                this.checkStatus,
                this.checkStatusError
            );
            // $FlowFixMe
            PetsService.instance = this;
        }

        return PetsService.instance;
    }

    seralizeBeforeSend = (configSerialize: any) => {
        // eslint-disable-next-line no-param-reassign
        configSerialize.data = qs.stringify(configSerialize.data);
        return configSerialize;
    };

    seralizeBeforeSendError = (error: any) => Promise.reject(error);

    checkStatus = (response: Response) => {
        const { status } = response;

        if (status >= 200 && status < 300) {
            return response.data;
        }
        if (status === 401 || status === 403) {
            return null;
        }

        return null;
    };

    checkStatusError = (error: $AxiosError<ResponseError>) => {
        const { response } = error.response;

        if (response && response.data) {
            return Promise.reject(response.data);
        }

        return response;
    };

    fetchAll(): Promise<$AxiosXHR<FecthAll>> {
        return this.api.get(this.endpointUrl);
    }

    fetchWithId(id: string): Promise<$AxiosXHR<Pet>> {
        const endpointUrl = `${this.endpointUrl}/${id}`;
        return this.api.get(endpointUrl);
    }

    updateAt(pet: Pet): Promise<$AxiosXHR<Pet>> {
        const endpointUrl = `${this.endpointUrl}/${id}`;
        const body = {
            ...pet
        }
        return this.api.put(endpointUrl, body);
    }

    create(pet: Pet): Promise<$AxiosXHR<Pet>> {
        const body = {
            ...pet
        }
        return this.api.post(this.endpointUrl, body);
    }

    remove(id: string): Promise<$AxiosXHR<any>> {
        const endpointUrl = `${this.endpointUrl}/${id}`;
        return this.api.delete(endpointUrl);
    }
}

const petsService = new PetsService();

export default petsService;
