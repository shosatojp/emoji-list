export function groupBy<T, K>(array: T[], keyFn: (t: T) => K): T[][] {
    const groupNames: K[] = [];
    const groups: T[][] = [];

    const groupNameMap: Map<K, number> = new Map();

    for (const e of array) {
        const currentGroupName = keyFn(e);
        const groupIdx = groupNameMap.get(currentGroupName);
        if (groupIdx === undefined) {
            groupNameMap.set(currentGroupName, groups.length);
            groupNames.push(currentGroupName);
            groups.push([e]);
        } else {
            groups[groupIdx].push(e);
        }
    }

    return groups;
}
