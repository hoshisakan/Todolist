import { convertToLocalDate } from '../../components/Timer/dateFormat'

export const exportTodoList = (export_data, filename) => {
    let file_downloader = require('js-file-download')
    let full_filename = convertToLocalDate(new Date().toDateString()) + `_${filename}.csv`
    file_downloader(export_data, full_filename)
}