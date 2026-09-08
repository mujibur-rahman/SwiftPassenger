import { View, Text, TouchableOpacity } from 'react-native';
import SvgIcon from '@/components/ui/SvgIcon';
import { useTheme } from "@/theme";

const EmptyCart = ({ navigation }) => {
    const { colors, isDark } = useTheme();
    const iconColor = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

    return (
        <View className="flex-1 items-center justify-center px-5">
            <SvgIcon name="shoppingCart" size={56} color={iconColor} style={{ opacity: 0.5 }} />
            <Text className="mt-3 font-inter text-foreground-muted">Your cart is empty</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate("FoodSearch")}
                className="mt-4 rounded-full bg-primary px-6 py-3"
            >
                <Text className="font-inter-semibold text-primary-foreground">Browse food</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EmptyCart