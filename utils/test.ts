export function buildUpdateClause(fields: Record<string, any>, ...resetValues): { setClause: string; clause: string[], values: any[] } {
    const setClauseArray: string[] = [];
    const values: any[] = [];

    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined) {
            setClauseArray.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (setClauseArray.length === 0) {
        throw new Error('没有提供任何字段进行更新');
    }

    values.push(resetValues); // 添加 id 到 values 数组的末尾
    return {
        setClause: setClauseArray.join(', '),
        clause: setClauseArray,
        values,
    };
}