import { writable } from 'svelte/store';

export const loading = writable<boolean>(false);
export const openModal = writable<boolean>(false);
export const selected = writable<{ id: string; name: string }>({ id: '', name: '' });
