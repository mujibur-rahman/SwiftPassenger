import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const RestaurantCard = ({ restaurant, onPress, warning }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
        >
            {/* Logo */}
            <View className="h-14 w-14 overflow-hidden rounded-xl border border-border">
                <Image
                    source={restaurant.logo}
                    style={{ width: 56, height: 56 }}
                    resizeMode="cover"
                />
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text
                    className="text-base font-inter-bold text-foreground"
                    numberOfLines={1}
                >
                    {restaurant.name}
                </Text>
                <Text
                    className="mt-0.5 text-xs font-inter text-foreground-muted"
                    numberOfLines={1}
                >
                    {restaurant.category}
                </Text>
                <View className="mt-1.5 flex-row items-center gap-1">
                    <Icon name="star" size={13} color={warning} />
                    <Text className="text-xs font-inter-medium text-foreground-secondary">
                        {restaurant.rating} ({(restaurant.ratingCount / 1000).toFixed(1)}k+)
                    </Text>
                    <Text className="ml-2 text-xs font-inter text-foreground-muted">
                        · {restaurant.etaMinutes}
                    </Text>
                </View>
            </View>

            {/* Food photo on right */}
            <View className="h-16 w-16 overflow-hidden rounded-xl">
                <Image
                    source={restaurant.foodImage}
                    style={{ width: 64, height: 64 }}
                    resizeMode="cover"
                />
            </View>
        </TouchableOpacity>
    )
}

export default RestaurantCard