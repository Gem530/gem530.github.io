export const silderMenu = () => {
    return useState('active', () => '0')
}

// 5的倍数数组
export const fives = () => {
    let fiveList: string[] = [] 
    for (let i = 5; i <= 180; i++) {
        if (i % 5 == 0) {
            fiveList.push((i+''))
        }
    }
    return useState('fiveList', () => fiveList)
}

// 2的倍数数组
export const twos = () => {
    let twoList: string[] = ['1'] 
    for (let i = 2; i <= 10; i++) {
        if (i % 2 == 0) {
            twoList.push((i+''))
        }
    }
    return useState('twoList', () => twoList)
}