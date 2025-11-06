export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const isValidPassword = (password: string): boolean => {
    return password.length >= 6
  }
  
  export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+261|0)[0-9]{9}$/
    return phoneRegex.test(phone)
  }
  
  export const isValidAge = (age: number): boolean => {
    return age >= 0 && age <= 150
  }
  
  export const isValidCoordinates = (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  }
  
