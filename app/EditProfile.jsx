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
    Modal,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";

const CLOUDINARY_CLOUD_NAME = "dqbcyecks"; 
const CLOUDINARY_UPLOAD_PRESET = "adoptrix"; 
const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(null);
    const [passwordChangeCount, setPasswordChangeCount] = useState(0);
    const [gender, setGender] = useState("Other");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [city, setCity] = useState("");
    const [stateName, setStateName] = useState("");
    const [userManualAddress, setUserManualAddress] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [adharFront, setAdharFront] = useState(null);
    const [adharBack, setAdharBack] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const stored = await AsyncStorage.getItem("userInfo");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setUserInfo(parsed);
                }
            } catch (e) {
                console.warn(e);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const stored = await AsyncStorage.getItem("user");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setUser(parsed);
                    setName(parsed?.name || "");
                    setPhoneNumber(parsed?.phoneNumber || parsed?.phone || "");
                    setImage(parsed?.image || parsed?.avatar || parsed?.profileImage || null);
                    setProfileImage(parsed?.profileImage || parsed?.avatar || null);
                    // support older key `AdhardCardImage` and newer `aadharFront`/`aadharBack`
                    const adh = parsed?.AdhardCardImage || parsed?.AdharCardImage || null;
                    if (parsed?.aadharFront || parsed?.aadharBack) {
                        setAdharFront(parsed?.aadharFront || null);
                        setAdharBack(parsed?.aadharBack || null);
                    } else if (Array.isArray(adh)) {
                        setAdharFront(adh[0] || null);
                        setAdharBack(adh[1] || null);
                    } else {
                        // adh might be a single URI string
                        setAdharFront(adh || null);
                        setAdharBack(null);
                    }
                    setPasswordChangeCount(parsed?.passwordChangeCount || 0);
                    setGender(parsed?.Gender || "Other");
                    setDateOfBirth(parsed?.dateOfBirth || "");
                    setPinCode(parsed?.pinCode || "");
                    setCity(parsed?.city || "");
                    setStateName(parsed?.state || "");
                    setUserManualAddress(parsed?.UserManualAddress || "");
                }
            } catch (e) {
                console.warn(e);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (pinCode && pinCode.length === 6) {
            fetchPincode(pinCode);
        }
    }, [pinCode]);

    const fetchPincode = async (code) => {
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
            const data = await res.json();
            if (Array.isArray(data) && data[0]?.Status === "Success") {
                const po = data[0].PostOffice && data[0].PostOffice[0];
                if (po) {
                    setCity(po?.District || "");
                    setStateName(po?.State || "");
                }
            }
        } catch (e) {
            console.warn('Pincode lookup failed', e);
        }
    };

    const pickImage = async (target = 'profile') => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false || permissionResult.status === 'denied' || permissionResult.status !== 'granted') return;

            const options = { allowsEditing: true, quality: 0.6 };
            const mediaTypeOption = ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : undefined;
            if (mediaTypeOption) options.mediaTypes = mediaTypeOption;

            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                if (target === 'profile') {
                    setImage(uri);
                    setProfileImage(uri);
                } else if (target === 'adhar') {
                    // backward compatibility: single-select path
                    setAdharFront(uri);
                    setAdharBack(null);
                }
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const pickAadharSingle = async (side) => {
        try {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (perm.status !== 'granted') {
                Alert.alert('Permission required');
                return;
            }

            const mediaTypeOption = ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : undefined;
            const result = await ImagePicker.launchImageLibraryAsync({
                ...(mediaTypeOption ? { mediaTypes: mediaTypeOption } : {}),
                quality: 0.7,
            });

            if (result.canceled) return;

            const uri = result.assets[0].uri;

            if (side === 'front') {
                setAdharFront(uri);
            } else {
                setAdharBack(uri);
            }
        } catch (e) {
            console.warn('pickAadharSingle error', e);
        }
    };


    // Prepare FormData for uploading Aadhaar images as an array 'aadhar[]'
    const prepareAadharFormData = (uris = []) => {
        const form = new FormData();
        uris.filter(Boolean).forEach((uri, idx) => {
            try {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
                // In React Native, file objects for FormData require a `uri`, `name`, and `type`.
                form.append('aadhar[]', {
                    uri,
                    name: filename || `aadhar_${idx}.jpg`,
                    type,
                });
            } catch (e) {
                console.warn('prepareAadharFormData error for', uri, e);
            }
        });
        return form;
    };

    // Upload a single image uri to Cloudinary (returns secure_url on success)
    const uploadToCloudinary = async (uri) => {
        if (!uri) return null;
        if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME' || CLOUDINARY_UPLOAD_PRESET === 'YOUR_UPLOAD_PRESET') {
            console.warn('Cloudinary config not set — skipping remote upload');
            return uri; // fall back to local URI
        }
        try {
            const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

            const formData = new FormData();

            // If the uri is a data URI (base64), Cloudinary accepts the data URI string directly
            if (typeof uri === 'string' && uri.startsWith('data:')) {
                formData.append('file', uri);
            } else {
                const filename = (uri || '').split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
                formData.append('file', { uri, name: filename || 'upload.jpg', type });
            }

            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const res = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
            });

            const data = await res.json();
            if (data?.secure_url) return data.secure_url;
            console.warn('Cloudinary upload failed', data);
            return uri;
        } catch (e) {
            console.warn('uploadToCloudinary error', e);
            return uri;
        }
    };

    // Upload multiple URIs to Cloudinary and return array of resulting URLs (or original URIs on failure)
    const uploadMultipleToCloudinary = async (uris = []) => {
        const results = [];
        for (const u of uris.filter(Boolean)) {
            // sequential to avoid too many concurrent uploads
            // can be optimized with Promise.all if desired
            // eslint-disable-next-line no-await-in-loop
            const r = await uploadToCloudinary(u);
            results.push(r);
        }
        return results;
    };

    const removeAadhar = async (slot) => {
        Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                    const updated = { ...(user || {}) };
                    if (slot === 'front') {
                        setAdharFront(null);
                        delete updated.aadharFront;
                    } else if (slot === 'back') {
                        setAdharBack(null);
                        delete updated.aadharBack;
                    }
                    // keep legacy array in sync
                    const arr = [updated.aadharFront, updated.aadharBack].filter(Boolean);
                    if (arr.length) updated.AdhardCardImage = arr; else delete updated.AdhardCardImage;
                    setUser(updated);
                    await AsyncStorage.setItem('user', JSON.stringify(updated));
                }
            }
        ]);
    };

    const handleSave = async () => {
        try {
            Toast.show({ type: 'info', text1: 'Saving', text2: 'Uploading images if needed...' });

            // upload profile image to Cloudinary (if local uri)
            let profileRemote = profileImage || image || null;
            if (profileRemote && !profileRemote.startsWith('http')) {
                // will return secure_url or the original uri if upload skipped/failed
                // eslint-disable-next-line no-await-in-loop
                profileRemote = await uploadToCloudinary(profileRemote);
            }

            // upload aadhar images
            let adharFrontRemote = adharFront || null;
            let adharBackRemote = adharBack || null;
            if (adharFrontRemote && !adharFrontRemote.startsWith('http')) {
                // eslint-disable-next-line no-await-in-loop
                adharFrontRemote = await uploadToCloudinary(adharFrontRemote);
            }
            if (adharBackRemote && !adharBackRemote.startsWith('http')) {
                // eslint-disable-next-line no-await-in-loop
                adharBackRemote = await uploadToCloudinary(adharBackRemote);
            }

            const updated = { ...(user || {}) };
            updated.name = name.trim();
            updated.phoneNumber = phoneNumber;
            updated.email = user?.email || updated.email;
            updated.UserManualAddress = address || userManualAddress;
            if (profileRemote) updated.profileImage = profileRemote; else delete updated.profileImage;

            // persist Aadhaar front/back and legacy array key using uploaded urls
            if (adharFrontRemote) updated.aadharFront = adharFrontRemote; else delete updated.aadharFront;
            if (adharBackRemote) updated.aadharBack = adharBackRemote; else delete updated.aadharBack;
            const aarr = [adharFrontRemote, adharBackRemote].filter(Boolean);
            if (aarr.length) updated.AdhardCardImage = aarr; else delete updated.AdhardCardImage;

            updated.Gender = gender;
            updated.dateOfBirth = dateOfBirth;
            updated.pinCode = pinCode;
            updated.city = city;
            updated.state = stateName;

            // password and external auth info removed from UI; keep passwordChangeCount if present
            await AsyncStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
            console.log("Updated user:", updated);
            Toast.show({ type: "success", text1: "Profile Saved", text2: "Your profile was updated." });
            router.back();
        } catch (e) {
            console.warn('handleSave error', e);
            Toast.show({ type: "error", text1: "Save Failed", text2: "Could not update profile." });
        }
    };


    const getInitials = () => {
        const text = name?.trim() || user?.name || user?.email?.split("@")[0] || "U";
        const a = text.charAt(0)?.toUpperCase() || "U";
        const b = text.charAt(1)?.toUpperCase() || "";
        return a + b;
    };

    return (
        <View className="flex-1 bg-background">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View className="flex-row items-center mb-4 px-4 pt-6">
                        <Pressable className="p-2" onPress={() => router.back()}>
                            <BackButton />
                        </Pressable>
                        <Text className="text-lg font-bold color-textPrimary ml-2">Edit Profile</Text>
                    </View>

                    <View className="px-6">
                        <View className="items-center mb-6">
                            <Pressable onPress={() => pickImage('profile')} className="w-28 h-28 rounded-full overflow-hidden items-center justify-center bg-buttonPrimary mb-3">
                                {profileImage || image ? (
                                    <Image source={{ uri: profileImage || image }} className="w-28 h-28" resizeMode="cover" />
                                ) : (
                                    <Text className="text-white font-bold text-3xl">{getInitials()}</Text>
                                )}
                            </Pressable>
                            <View className="flex-row space-x-3">
                                <Pressable onPress={() => pickImage('profile')} className="py-2 px-4 rounded-full bg-backgroundSecondary">
                                    <Text className="color-textPrimary">Change Photo</Text>
                                </Pressable>
                            </View>

                            <View className="mt-4 w-full">
                                <Text className="text-sm color-textPrimary mb-2 font-semibold">Aadhaar (Front / Back)</Text>
                                <View className="flex-row justify-between">
                                    <Pressable onPress={() => adharFront ? setPreviewImage(adharFront) : pickAadharSingle('front')} className="items-center w-1/2 mr-2">
                                        {adharFront ? (
                                            <Image source={{ uri: adharFront }} style={{ width: 140, height: 100, borderRadius: 8 }} />
                                        ) : (
                                            <View className="w-full h-24 rounded-xl border border-dashed border-gray-300 items-center justify-center">
                                                <Ionicons name="image-outline" size={28} color="#999" />
                                                <Text className="text-xs text-gray-500 mt-2">Front</Text>
                                            </View>
                                        )}
                                        <View className="flex-row mt-2">
                                            <Pressable onPress={() => pickAadharSingle('front')} className="py-1 px-3 rounded bg-backgroundSecondary mr-2">
                                                <Text className="text-sm color-textPrimary">Upload</Text>
                                            </Pressable>
                                            {adharFront && (
                                                <Pressable onPress={() => removeAadhar('front')} className="py-1 px-3 rounded bg-backgroundSecondary">
                                                    <Text className="text-sm text-red-600">Remove</Text>
                                                </Pressable>
                                            )}
                                        </View>
                                    </Pressable>

                                    <Pressable onPress={() => adharBack ? setPreviewImage(adharBack) : pickAadharSingle('back')} className="items-center w-1/2 ml-2">
                                        {adharBack ? (
                                            <Image source={{ uri: adharBack }} style={{ width: 140, height: 100, borderRadius: 8 }} />
                                        ) : (
                                            <View className="w-full h-24 rounded-xl border border-dashed border-gray-300 items-center justify-center">
                                                <Ionicons name="image-outline" size={28} color="#999" />
                                                <Text className="text-xs text-gray-500 mt-2">Back</Text>
                                            </View>
                                        )}
                                        <View className="flex-row mt-2">
                                            <Pressable onPress={() => pickAadharSingle('back')} className="py-1 px-3 rounded bg-backgroundSecondary mr-2">
                                                <Text className="text-sm color-textPrimary">Upload</Text>
                                            </Pressable>
                                            {adharBack && (
                                                <Pressable onPress={() => removeAadhar('back')} className="py-1 px-3 rounded bg-backgroundSecondary">
                                                    <Text className="text-sm text-red-600">Remove</Text>
                                                </Pressable>
                                            )}
                                        </View>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter full name"
                            placeholderTextColor={isDark ? "#454545ff" : "#3a3a3aaa"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                        />

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Email</Text>
                        <TextInput
                            value={userInfo?.email || user?.email}
                            editable={false}
                            selectTextOnFocus={false}
                            color={isDark ? "#fbfbfbff" : "#1a1a1aff"}
                            placeholderTextColor={"#3f3f3fff"}
                            className="bg-backgroundSecondary  rounded-xl h-12 px-3 mb-4 opacity-80"
                        />

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Phone Number</Text>
                        <TextInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Phone number"
                            keyboardType="phone-pad"
                            color={isDark ? "#ffffffff" : "#1a1a1aff"}
                            placeholderTextColor={isDark ? "#454545ff" : "#3a3a3aaa"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                        />

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Pin Code</Text>
                        <TextInput
                            value={pinCode}
                            onChangeText={setPinCode}
                            placeholder="Pin code"
                            keyboardType="number-pad"
                            color={isDark ? "#ffffffff" : "#1a1a1aff"}
                            placeholderTextColor={isDark ? "#454545ff" : "#3a3a3aaa"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                            maxLength={6}
                        />

                        <View className="flex-row space-x-4">
                            <View className="flex-1">
                                <Text className="text-sm color-textPrimary mb-2 font-semibold">City</Text>
                                <TextInput
                                    value={city}
                                    editable={false}
                                    onChangeText={setCity}
                                    color={isDark ? "#ffffffff" : "#1a1a1aff"}
                                    placeholderTextColor={isDark ? "#454545ff" : "#333333ff"}
                                    className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4 w-[90%]"
                                />
                            </View>
                            <View className="flex-1 mr-0">
                                <Text className="text-sm color-textPrimary mb-2 font-semibold">State</Text>
                                <TextInput
                                    value={stateName}
                                    editable={false}
                                    onChangeText={setStateName}
                                    color={isDark ? "#ffffffff" : "#1a1a1aff"}
                                    placeholderTextColor={isDark ? "#454545ff" : "#1a1a1aff"}
                                    className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4 w-[95%]"
                                />
                            </View>
                        </View>

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Manual Address (optional)</Text>
                        <TextInput
                            value={userManualAddress}
                            onChangeText={setUserManualAddress}
                            placeholderTextColor={isDark ? "#454545ff" : "#3a3a3aaa"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                            placeholder="Enter Nearest Address"
                        />

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Gender</Text>
                        <Pressable onPress={() => setShowGenderModal(true)} className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4 justify-center">
                            <Text className="text-base color-textPrimary opacity-70">{gender || 'Select gender'}</Text>
                        </Pressable>
                        {showGenderModal && (
                            <Modal transparent visible onRequestClose={() => setShowGenderModal(false)}>
                                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }} onPress={() => setShowGenderModal(false)}>
                                    <View style={{ backgroundColor: isDark ? '#222' : '#fff', borderRadius: 8, padding: 12 }}>
                                        {['Male', 'Female', 'Other'].map((opt) => (
                                            <Pressable key={opt} onPress={() => { setGender(opt); setShowGenderModal(false); }} style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#ccc' }}>
                                                <Text style={{ fontSize: 16, color: isDark ? '#fff' : '#000' }}>{opt}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </Pressable>
                            </Modal>
                        )}

                        <Text className="text-sm color-textPrimary mb-2 font-semibold">Date of Birth</Text>
                        <TextInput
                            value={dateOfBirth}
                            onChangeText={setDateOfBirth}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={isDark ? "#454545ff" : "#3a3a3aaa"}
                            className="bg-backgroundSecondary rounded-xl h-12 px-3 mb-4"
                        />

                        {previewImage && (
                            <Modal visible={true} transparent onRequestClose={() => setPreviewImage(null)}>
                                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setPreviewImage(null)}>
                                    <Image source={{ uri: previewImage }} style={{ width: '90%', height: '70%', borderRadius: 8 }} resizeMode="contain" />
                                </Pressable>
                            </Modal>
                        )}

                        <Pressable onPress={handleSave} className="h-12 rounded-2xl bg-buttonPrimary items-center justify-center mb-8">
                            <Text className="text-white font-bold">Save Changes</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EditProfile;