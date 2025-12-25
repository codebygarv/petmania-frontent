import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Image,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

const sampleFaqs = [
    {
        q: "How long until I get a response?",
        a: "Most tickets are answered within 24-48 hours. Urgent issues are prioritized.",
    },
    {
        q: "How do I change my account email?",
        a: "Go to Profile > Edit Profile and update your email there. If you cannot, raise a ticket and our team will assist.",
    },
    {
        q: "Where can I find my order history?",
        a: "Order history is available in the Profile > Orders screen. Contact us if something's missing or incorrect.",
    },
    {
        q: "How do I reset my password?",
        a: "Use the 'Forgot Password' link on the sign-in screen to receive a reset email. If you don't get it, check spam or raise a ticket.",
    },
    {
        q: "Can I cancel or change an order?",
        a: "If your order hasn't shipped we may be able to cancel or modify it—open a ticket with your order number as soon as possible.",
    },
    {
        q: "What is the adoption process?",
        a: "Submit an adoption request from the pet's listing, complete the application and a short home-check or phone interview may follow.",
    },
    {
        q: "Are there adoption fees?",
        a: "Yes—fees cover vaccinations, microchipping, and basic care. Fee details are shown on each pet's listing.",
    },
    {
        q: "How do I know a pet is right for my home?",
        a: "Read the pet profile for temperament and care needs. Ask specific questions in a ticket and we can suggest suitable matches.",
    },
    {
        q: "Is there post-adoption support?",
        a: "Yes—we offer guidance after adoption for behavior, health, and settling in. Open a support ticket anytime.",
    },
    {
        q: "What if I find a pet in poor health after adoption?",
        a: "Contact us immediately with photos and details. We'll advise next steps and help coordinate veterinary care if needed.",
    },
];

const StatusPill = ({ status }) => {
    const map = {
        open: "bg-green-100 color-textPrimary",
        closed: "bg-gray-200 color-textPrimary",
        pending: "bg-yellow-100 color-textPrimary",
    };
    return (
        <View className={"px-3 py-1 rounded-full " + (map[status] || map.open)}>
            <Text className="text-xs font-semibold">{status}</Text>
        </View>
    );
};

const SectionTitle = ({ children }) => (
    <Text className="text-base color-textPrimary font-bold mb-3">{children}</Text>
);

const HelpSupport = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [contact, setContact] = useState("");
    const [image, setImage] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [faqOpen, setFaqOpen] = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                const stored = await AsyncStorage.getItem("tickets");
                if (stored) setTickets(JSON.parse(stored));
            } catch (e) {
                console.warn(e);
            }
        };
        load();
    }, []);

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) return;

            const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.6 });
            if (!result.canceled && result.assets && result.assets.length > 0) setImage(result.assets[0].uri);
        } catch (e) {
            console.warn(e);
        }
    };

    const saveTickets = async (newTickets) => {
        try {
            await AsyncStorage.setItem("tickets", JSON.stringify(newTickets));
        } catch (e) {
            console.warn(e);
        }
    };

    const handleSubmit = async () => {
        if (!subject.trim() || !description.trim()) {
            Toast.show({ type: "error", text1: "Missing fields", text2: "Please fill subject and description." });
            return;
        }

        const newTicket = {
            id: Date.now().toString(),
            subject: subject.trim(),
            description: description.trim(),
            contact: contact.trim(),
            image: image || null,
            status: "open",
            createdAt: new Date().toISOString(),
        };

        const updated = [newTicket, ...tickets];
        setTickets(updated);
        await saveTickets(updated);

        setSubject("");
        setDescription("");
        setContact("");
        setImage(null);

        Toast.show({ type: "success", text1: "Ticket Raised", text2: "We received your request." });
        router.push("/app/(tab)/chat");
    };

    const handleDeleteTicket = (id) => {
        Alert.alert("Delete ticket", "Are you sure you want to delete this ticket?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    const updated = tickets.filter((t) => t.id !== id);
                    setTickets(updated);
                    await saveTickets(updated);
                    Toast.show({ type: "success", text1: "Deleted", text2: "Ticket removed." });
                },
            },
        ]);
    };

    return (
        <View className="flex-1 bg-background">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View className="flex-row items-center mb-4 px-4 pt-6">
                        <Pressable className="p-2" onPress={() => router.back()}>
                            <BackButton />
                        </Pressable>
                        <Text className="text-lg font-bold color-textPrimary ml-2">Help & Support</Text>
                    </View>

                    <View className="px-6">
                        <View className="mb-4">
                            <Text className="text-sm color-textPrimary mb-1 font-semibold">Raise a Ticket</Text>
                            <Text className="text-xs color-textPrimary opacity-80">Describe the issue clearly so we can help faster.</Text>
                        </View>

                        <TextInput
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="Subject"
                            placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-3"
                        />

                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe your issue"
                            placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                            className="bg-backgroundSecondary rounded-xl h-28 px-3 py-3 mb-3 text-base"
                            multiline
                        />

                        <TextInput
                            value={contact}
                            onChangeText={setContact}
                            placeholder="Contact (email or phone)"
                            placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-3"
                        />

                        <View className="flex-row items-center mb-4">
                            <Pressable onPress={pickImage} className="flex-row items-center py-2 px-4 rounded-full bg-backgroundSecondary mr-3">
                                <Ionicons name="attach" size={16} color={isDark ? "#fff" : "#111"} />
                                <Text className="color-textPrimary ml-2">Attach Image</Text>
                            </Pressable>
                            {image ? <Image source={{ uri: image }} className="w-16 h-16 rounded-lg" resizeMode="cover" /> : null}
                        </View>

                        <Pressable onPress={handleSubmit} className="h-12 rounded-2xl bg-buttonPrimary items-center justify-center mb-6">
                            <Text className="text-white font-bold">Send Ticket</Text>
                        </Pressable>

                        <SectionTitle>Your Tickets</SectionTitle>
                        {tickets.length === 0 ? (
                            <View className="bg-backgroundSecondary rounded-xl p-4 mb-4">
                                <Text className="color-textPrimary mb-2">No tickets yet.</Text>
                                <Text className="text-xs color-textPrimary opacity-80">Create a ticket and we'll get back to you shortly.</Text>
                            </View>
                        ) : (
                            tickets.map((t) => (
                                <View key={t.id} className="bg-backgroundSecondary rounded-xl p-3 mb-3 shadow-sm">
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1 mr-3">
                                            <Text className="font-bold color-textPrimary text-base">{t.subject}</Text>
                                            <Text className="color-textPrimary opacity-60 text-xs">{new Date(t.createdAt).toLocaleString()}</Text>
                                            <Text className="color-textPrimary mt-2">{t.description}</Text>
                                        </View>
                                        <View className="items-end">
                                            <StatusPill status={t.status} />
                                            <Pressable onPress={() => handleDeleteTicket(t.id)} className="mt-3 py-1 px-2 rounded bg-red-500 flex-row items-center">
                                                <Ionicons name="trash" size={12} color="#fff" />
                                                <Text className="text-white text-xs ml-2">Delete</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                    {t.image ? <Image source={{ uri: t.image }} className="w-full h-40 rounded-lg mt-3" resizeMode="cover" /> : null}
                                </View>
                            ))
                        )}

                        <SectionTitle>FAQs</SectionTitle>
                        {sampleFaqs.map((f, i) => (
                            <Pressable
                                key={i}
                                onPress={() => setFaqOpen((s) => ({ ...s, [i]: !s[i] }))}
                                className="bg-backgroundSecondary rounded-xl p-3 mb-3"
                            >
                                <View className="flex-row justify-between items-start">
                                    <Text className="font-bold color-textPrimary flex-1 flex-wrap">{f.q}</Text>
                                    <View className="flex-row items-center ml-3">
                                        <Text className="color-textPrimary opacity-80 mr-2">{faqOpen[i] ? "Hide" : "Show"}</Text>
                                        <Ionicons name={faqOpen[i] ? "chevron-up" : "chevron-down"} size={16} color={isDark ? "#fff" : "#111"} />
                                    </View>
                                </View>
                                {faqOpen[i] ? <Text className="color-textPrimary mt-2 opacity-90">{f.a}</Text> : null}
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default HelpSupport;