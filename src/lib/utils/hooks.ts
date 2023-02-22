import useSWR from 'swr';
import { Contact, Engagement } from '../models';
import User from '../models/user';

type Response<T> = {
    // http status code
    code: number;

    // if success (2xx)
    data?: T;

    // if error (4xx | 5xx)
    msg?: string;
}

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

function useUsers() {
    const { data, error, isLoading } = useSWR<Response<User[]>>(`/api/users`, fetcher);

    return {
        users: data?.data || [],
        loading: isLoading,
        error: error,
    }
}

function useContacts() {
    const { data, error, isLoading } = useSWR<Contact[]>(`/api/contacts`, fetcher);

    return {
        contacts: data,
        loading: isLoading,
        error: error
    };
}

function useEngagements() {
    const { data, error, isLoading } = useSWR<Engagement[]>(`/api/engagements`, fetcher);

    return {
        engagements: data,
        loading: isLoading,
        error: error
    };
}

export { useContacts, useEngagements, useUsers };