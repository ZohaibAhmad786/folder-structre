import { Text } from 'react-native'


const lightFont = ({ ...props }) => {
    return (
        <Text>lightFont</Text>
    )
}
const regularFont = ({ ...props }) => {
    return (
        <Text>regularFont</Text>
    )
}

const mediumFont = ({ ...props }) => {
    return (
        <Text>mediumFont</Text>
    )
}
const semiBoldFont = ({ ...props }) => {
    return (
        <Text>semiBoldFont</Text>
    )
}
const boldFont = ({ ...props }) => {
    return (
        <Text>boldFont</Text>
    )
}

const APP_NAME_TYPO_GRAPHY = {
    Light: lightFont,
    Regular: regularFont,
    Medium: mediumFont,
    SemiBold: semiBoldFont,
    Bold: boldFont,
}

export default APP_NAME_TYPO_GRAPHY;