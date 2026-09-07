import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import IconButton from "../ui/IconButton";

const MenuItemRow = ({ item, onAdd, primary, onPrimary }) => {
    return (
        <View className="mb-4 flex-row items-start gap-3 border-b border-border pb-4">
            <View className="flex-1 pr-2">
                <Text
                    className="text-lg font-inter-bold text-foreground"
                    numberOfLines={1}
                >
                    {item.name}
                </Text>
                <Text
                    className="mt-1 text-sm font-inter text-foreground-muted"
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
                <Text className="mt-2 text-lg font-inter-bold text-foreground">
                    ${item.price.toFixed(2)}
                </Text>
            </View>

            <View className="relative">
                <View className="h-20 w-20 overflow-hidden rounded-xl">
                    <Image
                        source={item.image}
                        style={{ width: 80, height: 80 }}
                        resizeMode="cover"
                    />
                </View>
                <IconButton
                    icon="plus"
                    size={32}
                    iconSize={18}
                    onPress={() => onAdd(item)}
                    variant="custom"
                    style={{
                        backgroundColor: primary,
                    }}
                    className="absolute -bottom-2 -right-2 z-10"
                />
            </View>
        </View>
    )
}

export default MenuItemRow