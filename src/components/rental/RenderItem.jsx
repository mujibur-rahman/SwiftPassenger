import { View, Text, TouchableOpacity, Image } from 'react-native'
import { formatDate } from '@/utils/helpers'
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from '@/theme';
import { useCancelRentalBookingMutation, useGetMyRentalBookingsQuery } from '@/features/rental/rentalApi';

const RenderItem = ({ item }) => {
    const { refetch } =
        useGetMyRentalBookingsQuery();
    const [cancelBooking] = useCancelRentalBookingMutation();

    const { colors } = useTheme();
    const primary = colors?.primary ?? "#38BDF8";

    const onCancel = async (id) => {
        try {
            await cancelBooking(id).unwrap();
            refetch();
        } catch (_) {
            // local update already handled by invalidatesTags on success
        }
    };

    return (
        <View className="mb-4 overflow-hidden rounded-2xl border border-border bg-card">
            <View className="flex-row p-3">
                {item.carImage ? (
                    <Image
                        source={{ uri: item.carImage }}
                        className="h-20 w-24 rounded-xl"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="h-20 w-24 items-center justify-center rounded-xl bg-background-muted">
                        <Icon name="car" size={28} color={primary} />
                    </View>
                )}
                <View className="ml-3 flex-1 justify-center">
                    <Text className="text-base font-inter-bold text-foreground">
                        {item.carName || "Car"}
                    </Text>
                    <Text className="mt-0.5 text-xs text-foreground-muted">
                        {item.bookingCode || item.id}
                    </Text>
                    <Text className="mt-1 text-xs text-foreground-muted">
                        {formatDate(item.pickupDate)} → {formatDate(item.returnDate)}
                    </Text>
                    <View className="mt-1 flex-row items-center">
                        <View
                            className={`rounded-full px-2 py-0.5 ${item.status === "cancelled"
                                ? "bg-error/20"
                                : "bg-success/20"
                                }`}
                        >
                            <Text
                                className="text-[10px] font-inter-semibold uppercase"
                                style={{
                                    color:
                                        item.status === "cancelled"
                                            ? colors?.error
                                            : colors?.success,
                                }}
                            >
                                {item.status || "confirmed"}
                            </Text>
                        </View>
                        <Text className="ml-2 text-sm font-inter-bold" style={{ color: primary }}>
                            $ {(item.pricing?.grandTotal || 0).toLocaleString()}
                        </Text>
                    </View>
                </View>
            </View>
            {item.status !== "cancelled" && (
                <TouchableOpacity
                    onPress={() => onCancel(item.id)}
                    className="border-t border-border py-2.5 items-center"
                >
                    <Text className="text-sm text-error">Cancel booking</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default RenderItem