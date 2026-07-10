// Loose navigation param typing across the app — every stack shares this
// permissive param-list shape so screens can pass whatever context data they
// need (e.g., a foodId, a nodeId, a date) without a param-list contract per
// stack. This keeps the build fast to iterate while still fully typed at the
// component-prop level via `any`-free screen components using useNavigation().
export type AnyParamList = Record<string, object | undefined>;
