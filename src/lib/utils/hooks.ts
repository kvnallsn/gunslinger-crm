import useSWR from 'swr';
import { Contact, Engagement } from '../models';
import { ContactNote } from '../models/contact';
import { EngagementNote } from '../models/engagement';
import Group from '../models/groups';
import { Topic } from '../models/topic';
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

function _throw(msg: string) { throw new Error(msg); }

const fetcher2 = (url: string) => fetch(url, { credentials: 'include' })
    .then(response => response.ok ? response.json() : _throw(`HTTP error: ${response.status} / ${response.statusText}`))
    .then(response => response.data);

export function useMe(username: string) {
    const { data, error, isLoading, mutate } = useSWR<User>([`/api/me`, username], ([url, username]: string[]) => fetcher2(url));

    return {
        me: data,
        loading: isLoading,
        error: error,
        mutate
    }
}

export function useUsers() {
    const { data, error, isLoading, mutate } = useSWR<User[]>(`/api/users`, fetcher2);

    return {
        users: data ?? [],
        loading: isLoading,
        error: error,
        mutate
    }
}

export function useGroups() {
    const { data, error, isLoading, mutate } = useSWR<Group[]>(`/api/groups`, fetcher2);

    return {
        groups: data ?? [],
        loading: isLoading,
        error: error,
        mutate
    }
}

export function useContacts() {
    const { data, error, isLoading } = useSWR<Contact[]>(`/api/contacts`, fetcher);

    return {
        contacts: data ?? [],
        loading: isLoading,
        error: error
    };
}

export function useContactEngagements(contactId: string) {
    const { data, error, isLoading } = useSWR<Engagement[]>(contactId ? ['/api/contact/engagements', contactId] : [null, null], ([url, id]: string[]) => fetcher2(`${url}?id=${id}`));

    return {
        engagements: data ?? [],
        loading: isLoading,
        error: error
    };
}

export function useContactNotes(contactId: string) {
    const { data, error, isLoading, mutate } = useSWR<ContactNote[]>(contactId ? ['/api/contact/notes', contactId] : [null, null], ([url, id]: string[]) => fetcher2(`${url}?id=${id}`));

    return {
        notes: data ?? [],
        loading: isLoading,
        error: error,
        mutate
    };
}

export function useTopics() {
    const { data, error, isLoading } = useSWR<Topic[]>(`/api/topics`, fetcher2);

    return {
        topics: data ?? [],
        loading: isLoading,
        error: error
    };
}

export function useEngagements() {
    const { data, error, isLoading } = useSWR<Engagement[]>(`/api/engagements`, fetcher2);

    return {
        engagements: data ?? [],
        loading: isLoading,
        error: error
    };
}

export function useEngagement(id: string) {
    const { data, error, isLoading } = useSWR<Engagement>(id ? ['/api/engagements', id] : [null, null], ([url, id]: string[]) => fetcher2(`${url}?id=${id}`));

    return {
        engagement: data,
        loading: isLoading,
        error: error
    };
}

export function useEngagementNotes(id: string) {
    const { data, error, isLoading } = useSWR<EngagementNote[]>(id ? ['/api/engagement/notes', id] : [null, null], ([url, id]: string[]) => fetcher2(`${url}?id=${id}`));

    return {
        notes: data ?? [],
        loading: isLoading,
        error: error
    };
}

export function useEngagementTopics(id: string) {
    const { data, error, isLoading } = useSWR<Topic[]>(id ? ['/api/engagement/topics', id] : [null, null], ([url, id]: string[]) => fetcher2(`${url}?id=${id}`));

    return {
        topics: data ?? [],
        loading: isLoading,
        error: error
    };
}