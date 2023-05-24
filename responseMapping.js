// export default {
    export const candleMapping = (data) => {
        return data.map(ele => {
            return {
                x: new Date(ele[0]),
                y: [ele[1]]
            }
        })
    }
// }