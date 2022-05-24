// // 实现js的split方法
// function a(str, code) {
//     let temp = []
//     let codeTemp = []
//     for (let i = 0; i < str.length; i++) {
//         let num = str.indexOf(code, i)
//         if (num === i) {
//             codeTemp.push(num)
//         }
//     }
//     codeTemp.forEach((num, index) => {
//         let lastNum = index ? codeTemp[index - 1] + 2 : index
//         temp.push(str.substring(lastNum, num))
//     })
//     temp.push(str.substring(codeTemp[codeTemp.length - 1] + 2))
//     console.log(temp)
// }
// a('aaa&&bb&&cc', '&&') // [ 'aaa', 'bb', 'cc' ]


// // 返回不重复的最长的字符串
// function strLength(s) {
//     let i = 0,
//         j = 0,
//         maxLength = 0
//     let set = new Set()
//     for (i; i < s.length; i++) {
//         if (!set.has(s[i])) {
//             set.add(s[i])
//             maxLength = Math.max(maxLength, set.size)
//         } else {
//             while (set.has(s[i])) {
//                 set.delete(s[j])
//                 j++
//             }
//             set.add(s[i])
//         }
//     }
//     return maxLength
// }
// console.log(strLength('abcabcbb')) // 3
// console.log(strLength('bbbb')) // 1
// console.log(strLength('dvdf')) // 3
// console.log(strLength("pwwkew")) // 3


// // 找出两个数组的中位数
// function findMedianArrays(arr1, arr2) {
//     let arr = [...arr1, ...arr2]
//     arr = arr.sort((a, b) => { return a - b })
//         // console.log(arr)
//     const num1 = arr.length / 2
//     if (arr.length % 2 === 0) {
//         // 数组是偶数
//         const num2 = num1 - 1
//         const res = (arr[num1] + arr[num2]) / 2
//         return res
//     } else {
//         // 数组是单数
//         return arr[Math.floor(num1)]
//     }
// }
// console.log(findMedianArrays([1, 3], [2])) // 2
// console.log(findMedianArrays([1, 4], [2, 3])) // 2.5
// console.log(findMedianArrays([1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 6], [2, 3])) // 3


// // 将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。
// function convert(s, numRows) {
//     if (numRows == 1)
//         return s
//     const ans = new Array(),
//         n = s.length
//     for (let i = 0; i < numRows; i++)
//         if (i == 0 || i == numRows - 1)
//             for (let j = i; j < n; j += numRows * 2 - 2)
//                 ans.push(s.charAt(j))
//         else
//             for (let j = i, cur = 0; j < n; cur ^= 1) {
//                 ans.push(s.charAt(j))
//                 if (cur == 0)
//                     j += (numRows - 1 - i) * 2
//                 else
//                     j += i * 2
//             }
//     return ans.join("")
// }
// console.log(convert('PAYPALISHIRING', 3)) // PAHNAPLSIIGYIR


// // 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
// var reverse = function(x) {
//     let str = x < 0 ? '-' : ''
//     x = Math.abs(x)
//     return Number(str + x.toString().split('').reverse().join(''))
// };
// console.log(reverse(-123))


// 返回字符串中的数字
// function myAtoi(s) {
//     return Number(s.trim().split('').filter(item => { return !isNaN(+item) || item === '-' }).join(''))
// };
// console.log(myAtoi('words and -987'))


// // 判断当前数字是否为回文数 121
// function isPalindrome(x) {
//     let flag = false
//     x = x.toString()
//     for (let i = 0; i < x.length; i++) {
//         if (x[i] === x[x.length - i - 1]) {
//             flag = true
//         } else {
//             return false
//         }
//         // console.log(i, x[i], x[x.length - i - 1], flag)
//     }
//     return flag
// }
// console.log(isPalindrome(121))
// console.log(isPalindrome(1000021))


// 给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。
var isMatch = function(s, p) {
    const num1 = p.indexOf('.')
    const num2 = p.indexOf('*')
    console.log(num1, num2)
    if (num1 === -1 && num2 === -1) {
        return s === p
    } else if (num2 !== -1) {
        let reg = new RegExp(`${p.substring(num2 - 1, num2)}*`)
        console.log(reg, reg.test(s))
        return reg.test(s)
    }
};
console.log(isMatch('aa', 'a'))
console.log(isMatch('aa', 'aa'))
console.log(isMatch('aa', 'a*'))
console.log(isMatch('aa', '.*'))