import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const OrderCard = ({ order, isActive, onPress, primary }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            className="mb-3 flex-row gap-3 rounded-2xl border border-border bg-card p-3"
        >
            <View className="h-16 w-16 overflow-hidden rounded-xl">
                <Image source={order.image} style={{ width: 64, height: 64 }} resizeMode="cover" />
            </View>
            <View className="flex-1">
                <View className="flex-row items-center justify-between">
                    <Text className="text-[15px] font-inter-bold text-foreground" numberOfLines={1}>
                        {order.restaurant}
                    </Text>
                    {isActive ? (
                        <View className="rounded-full bg-primary/15 px-2 py-0.5">
                            <Text className="text-[11px] font-inter-semibold text-primary">{order.eta}</Text>
                        </View>
                    ) : (
                        <Text className="text-[11px] font-inter text-foreground-muted">{order.date}</Text>
                    )}
                </View>
                <Text className="mt-0.5 text-xs font-inter text-foreground-muted" numberOfLines={1}>
                    {order.items}
                </Text>
                <View className="mt-1.5 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                        <Icon name={isActive ? "bike" : "check-circle"} size={13} color={isActive ? primary : "#34D399"} />
                        <Text className="text-xs font-inter-medium" style={{ color: isActive ? primary : "#34D399" }}>
                            {order.status}
                        </Text>
                    </View>
                    <Text className="text-[13px] font-inter-bold text-foreground">
                        ${order.total.toFixed(2)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default OrderCard