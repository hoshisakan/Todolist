export const color = [
    '#28bf28',
    '#ff0000',
    '#0000ff',
    '#1e90ff',
    '#ffa500',
    '#800080',
    '#000080',
    '#0047ab',
    '#ff8c00',
    '#1e90ff',
    '#9acd32',
    '#ff1493',
    '#0000cd',
    '#fa8072',
]

// const randomHeaderColor = Math.floor(Math.random() * headerColor.length)

// Math.floor(Math.random() * range), generate range index of color
export const randomColor = () => {
    return color[Math.floor(Math.random() * color.length)]
}
