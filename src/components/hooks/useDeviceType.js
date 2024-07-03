export const useDeviceType =()=>{
    let device='desktop'
    if (window.innerWidth > 1024 ) device="desktop"
    if (window.innerWidth > 640 && window.innerWidth < 1025 ) device="tablet"
    if (window.innerWidth < 641 ) device="mobile"
    return device
}