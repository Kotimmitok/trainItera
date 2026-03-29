const SETTINGS_KEY = 'trainItera_settings';

export interface Settings {
    default_rest_seconds: number;
    rest_enabled: boolean;
    weight_unit: 'kg' | 'lbs';
    language: 'en' | 'de';
}

const DEFAULT_SETTINGS: Settings = {
    default_rest_seconds: 90,
    rest_enabled: true,
    weight_unit: 'kg',
    language: 'en'
};

export function getSettings(): Settings {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
}

export function saveSettings(settings: Partial<Settings>): void {
    const current = getSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
}