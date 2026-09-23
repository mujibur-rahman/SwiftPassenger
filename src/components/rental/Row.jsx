import { View, Text } from 'react-native'

const Row = ({ label, value }) => {
    return (
        <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-foreground-muted">{label}</Text>
            <Text className="text-sm font-inter-semibold text-foreground max-w-[60%] text-right">
                {value || "—"}
            </Text>
        </View>
    )
}

export default Row