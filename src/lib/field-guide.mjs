import {assetUrl} from './public-assets.mjs';
import { islands } from './islands.ts';
import { creatures } from './creatures.ts';
import { explorationVisitors } from './exploration.mjs';
export const guideVersion = 1;
export const guideStorageKey = 'yiwu.eco-island.field-guide';
const names = { rabbit: '兔子', guinea: '天竺鼠', hamster: '倉鼠', parrot: '鸚鵡', hedgehog: '刺蝟', ferret: '雪貂', meerkat: '狐獴', chinchilla: '龍貓', glider: '蜜袋鼯' };
export const guideEntries = [
    ...Object.entries(names).map(([id, name]) => {
        const island = islands.find(i => i.id === id), resident = creatures.find(c => c.island === id);
        return { id, name, group: 'hotel', description: island.description, facts: island.facts.slice(0, 2), lifespanKey: id,
            image: assetUrl(`/assets/${resident.asset}.webp`), atlas: false, hint: `在${island.name}點一下小動物`, place: island.name };
    }),
    ...explorationVisitors.map(p => ({ id: p.id, name: p.name, group: 'visitor', description: `在${p.setting}安靜停留的周邊生態小訪客。`, facts: [p.fact],
        image: assetUrl(`/assets/exploration/${p.id}-actor.webp`), atlas: true, hint: `到${p.setting}尋找牠`, place: p.setting, source: p.source }))
];
const known = new Set(guideEntries.map(e => e.id));
const normalize = ids => guideEntries.filter(e => ids.includes(e.id)).map(e => e.id);
export function decodeGuide(raw) {
    if (raw === null || raw === undefined)
        return { ids: [], storageState: 'ready' };
    try {
        const data = JSON.parse(raw);
        if (!data || typeof data !== 'object' || Array.isArray(data))
            return { ids: [], storageState: 'recovered' };
        // Preserve an unknown version on disk until the user explicitly resets it.
        if (data.version !== guideVersion)
            return { ids: [], storageState: 'unsupported' };
        if (!Array.isArray(data.discovered))
            return { ids: [], storageState: 'recovered' };
        return { ids: normalize(data.discovered.filter(id => typeof id === 'string' && known.has(id))), storageState: 'ready' };
    }
    catch {
        return { ids: [], storageState: 'recovered' };
    }
}
export function encodeGuide(ids) { return JSON.stringify({ version: guideVersion, discovered: normalize(ids) }); }
export function guideComplete(ids) { return guideEntries.every(e => ids.includes(e.id)); }
// No browser access at module load or during SSR. The UI explicitly loads on mount.
// Store writes happen on discoveries/reset only, never on animation ticks or render.
export function createGuideStore({ getStorage, onChange = () => { }, onDiscover = () => { } }) {
    let ids = [], storageState = 'ready', loaded = false;
    const snapshot = () => ({ ids: [...ids], storageState, loaded });
    const emit = () => onChange(snapshot());
    const read = () => { try {
        return decodeGuide(getStorage().getItem(guideStorageKey));
    }
    catch {
        return { ids: [], storageState: 'unavailable' };
    } };
    function persist(force = false) {
        if (storageState === 'unsupported' && !force)
            return;
        try {
            getStorage().setItem(guideStorageKey, encodeGuide(ids));
            storageState = 'ready';
        }
        catch {
            storageState = 'unavailable';
        }
    }
    return { snapshot,
        load() { if (loaded)
            return; const saved = read(); ids = saved.ids; storageState = saved.storageState; loaded = true; emit(); },
        discover(id) {
            if (!known.has(id))
                return false;
            if (!loaded) {
                const saved = read();
                ids = saved.ids;
                storageState = saved.storageState;
                loaded = true;
            }
            const fresh = read();
            if (fresh.storageState === 'ready')
                ids = normalize([...ids, ...fresh.ids]);
            storageState = fresh.storageState;
            if (ids.includes(id)) {
                emit();
                return false;
            }
            ids = normalize([...ids, id]);
            persist();
            emit();
            onDiscover(id, guideComplete(ids));
            return true;
        },
        reset() { ids = []; loaded = true; persist(true); emit(); },
        sync() { const saved = read(); ids = saved.ids; storageState = saved.storageState; loaded = true; emit(); }
    };
}
