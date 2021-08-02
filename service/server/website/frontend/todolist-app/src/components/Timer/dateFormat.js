import { format } from 'date-fns'

export const convertToLocalDate = (convert_datetime) => {
    return format(new Date(convert_datetime), 'yyyy-MM-dd HH:mm:ss')
}