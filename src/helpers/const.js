import md5 from "blueimp-md5"

export const API = 'https://api.valantis.store:41000/'
export const LIMIT = 50
export const PASSWORD = md5(`Valantis_${new Date().toLocaleDateString().split('.').reverse().join('')}`)