import React, { useEffect, useState } from "react";
import {
    View, Text, Image, TextInput, TouchableOpacity,
    ScrollView, Pressable, ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailsAction, updateUserProfileAction } from "@/redux/actions/userActions";
import BackButton from "@/components/BackButton";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useColorScheme } from "nativewind";
import Toast from "react-native-toast-message";
import EditProfileSkeleton from "@/components/EditProfile/EditProfileSkeleton";

const SectionHeader = ({ title, isDark }) => (
    <View style={{ marginBottom: 12, marginTop: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: isDark ? '#e0e0e0' : '#1a1a1a', letterSpacing: 0.3 }}>
            {title}
        </Text>
        <View className="bg-buttonPrimary" style={{ height: 2, width: 36, borderRadius: 2, marginTop: 4 }} />
    </View>
);

const FieldLabel = ({ label, isDark }) => (
    <Text className="color-textSecondary" style={{ fontSize: 13, marginBottom: 4, fontWeight: '500' }}>
        {label}
    </Text>
);

const InputField = ({ isDark, style, ...props }) => (
    <TextInput
        placeholderTextColor="#9ca3af"
        className="bg-backgroundSecondary text-textPrimary border border-gray-200 dark:border-gray-800"
        style={[{
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 14,
            marginBottom: 4,
        }, style]}
        {...props}
    />
);

const EditProfile = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const [profileUri, setProfileUri] = useState(null);
    const [profileBase64, setProfileBase64] = useState(null);

    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        gender: 'male',
        dateOfBirth: '',
        pinCode: '',
        city: '',
        state: '',
        UserManualAddress: '',
        adharCardNumber: '',
    });

    const pickImage = async (type) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Toast.show({ type: "error", text1: "Permission Denied", text2: "Media library access is required" });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0.6,
        });

        if (result.canceled) return;
        const { uri, base64 } = result.assets[0];

        if (type === "profile") {
            setProfileUri(uri);
            setProfileBase64(base64);
        }
    };

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getUserDetailsAction());

            if (res?.data?.user) {
                const u = res.data.user;
                setInitialValues({
                    name: u?.name || '',
                    phoneNumber: u?.phoneNumber || '',
                    email: u?.email || '',
                    gender: u?.Gender?.toLowerCase() || 'male',
                    dateOfBirth: u?.dateOfBirth ? String(u.dateOfBirth).slice(0, 10) : '',
                    pinCode: u?.pinCode || '',
                    city: u?.city || '',
                    state: u?.state || '',
                    UserManualAddress: u?.UserManualAddress || u?.userManualAddress || '',
                    adharCardNumber: u?.adharCardNumber || '',
                });

                if (u?.profileImage) setProfileUri(u.profileImage);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUserDetails(); }, []);

    const fetchPinDetails = async (pin, setFieldValue) => {
        if (!/^[0-9]{6}$/.test(pin)) return;
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await res.json();
            if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length) {
                const po = data[0].PostOffice[0];
                setFieldValue('city', po.District || po.Name || '');
                setFieldValue('state', po.State || '');
            } else {
                setFieldValue('city', '');
                setFieldValue('state', '');
            }
        } catch (err) {
            console.warn('Failed to fetch pin details', err);
        }
    };

    const getLocation = async (setFieldValue) => {
        try {
            setLocationLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({ type: "error", text1: "Permission Denied", text2: "Location permission is required" });
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            if (loc?.coords) {
                const address = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });
                const city = address[0]?.city || address[0]?.district || '';
                const state = address[0]?.region || '';
                const pinCode = address[0]?.postalCode || '';
                if (city) setFieldValue('city', city);
                if (state) setFieldValue('state', state);
                if (pinCode) {
                    setFieldValue('pinCode', pinCode);
                    fetchPinDetails(pinCode, setFieldValue);
                }
            }
        } catch (error) {
            Toast.show({ type: "error", text1: "Error", text2: "Could not fetch location" });
        } finally {
            setLocationLoading(false);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        phoneNumber: Yup.string()
            .required('Phone number is required')
            .matches(/^\d{10}$/, 'Must be 10 digits'),
        gender: Yup.string().oneOf(['male', 'female', 'other']),
        dateOfBirth: Yup.string()
            .required('Date of birth is required')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
            .test('dob', 'Must be in the past', (value) => {
                if (!value) return false;
                const d = new Date(value);
                return d.toString() !== 'Invalid Date' && d <= new Date();
            }),
        pinCode: Yup.string().required('Pin code is required').matches(/^\d{6}$/, 'Must be 6 digits'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        UserManualAddress: Yup.string().notRequired(),
        adharCardNumber: Yup.string()
            .required('Aadhaar number is required')
            .matches(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
    });

    const bg = isDark ? '#121212' : '#ffffff';
    const cardBg = isDark ? '#1a1a1a' : '#fafafa';
    const borderColor = isDark ? '#2a2a2a' : '#ededed';

    if (loading) return <EditProfileSkeleton />;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: bg }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
        >
            <ScrollView style={{ flex: 1, backgroundColor: bg }} showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                        <Pressable style={{ padding: 4 }}>
                            <BackButton />
                        </Pressable>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: isDark ? '#e0e0e0' : '#1a1a1a', marginLeft: 10 }}>
                            Edit Profile
                        </Text>
                    </View>

                    {/* Verification Status Banner */}
                    {!userInfo?.isVerified ? (
                        <View style={{
                            backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12, marginBottom: 20,
                            flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FEF3C7'
                        }}>
                            <Ionicons name="alert-circle" size={20} color="#D97706" />
                            <Text style={{ marginLeft: 8, fontSize: 13, color: '#92400E', flex: 1 }}>
                                Your profile is not verified. Please provide your Aadhaar details to enable all features.
                            </Text>
                        </View>
                    ) : (
                        !userInfo?.isAadhaarVerified ? (
                            <View style={{
                                backgroundColor: '#ECFDF5', borderRadius: 12, padding: 12, marginBottom: 20,
                                flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1FAE5'
                            }}>
                                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                                <Text style={{ marginLeft: 8, fontSize: 13, color: '#065F46', flex: 1 }}>
                                    Your Identity details are submitted for verification.
                                </Text>
                            </View>
                        ) : (
                            <View style={{
                                backgroundColor: '#ECFDF5', borderRadius: 12, padding: 12, marginBottom: 20,
                                flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1FAE5'
                            }}>
                                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                                <Text style={{ marginLeft: 8, fontSize: 13, color: '#065F46', flex: 1 }}>
                                    Your Identity details are verified.
                                </Text>
                            </View>
                        )
                    )}

                    {/* Profile Photo */}
                    <View style={{ alignItems: 'center', marginBottom: 28 }}>
                        <TouchableOpacity onPress={() => pickImage("profile")} style={{ position: 'relative' }}>
                            {profileUri ? (
                                <Image
                                    source={{ uri: profileUri }}
                                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#E0583D' }}
                                />
                            ) : (
                                <View style={{
                                    width: 100, height: 100, borderRadius: 50,
                                    backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0',
                                    alignItems: 'center', justifyContent: 'center',
                                    borderWidth: 2, borderColor: isDark ? '#333' : '#ddd',
                                }}>
                                    <Ionicons name="person" size={38} color={isDark ? '#555' : '#bbb'} />
                                </View>
                            )}
                            <View style={{
                                position: 'absolute', bottom: 0, right: 0,
                                backgroundColor: '#E0583D', borderRadius: 14, padding: 5,
                                borderWidth: 2, borderColor: bg,
                            }}>
                                <Ionicons name="camera" size={14} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <Text style={{ marginTop: 8, fontSize: 13, color: isDark ? '#888' : '#999' }}>
                            Tap to change photo
                        </Text>
                    </View>

                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            const GenderValue =
                                values.gender === "male" ? "Male" :
                                    values.gender === "female" ? "Female" : "Other";

                            const payload = {
                                name: values.name,
                                phoneNumber: values.phoneNumber,
                                Gender: GenderValue,
                                dateOfBirth: values.dateOfBirth,
                                pinCode: values.pinCode,
                                city: values.city,
                                state: values.state,
                                UserManualAddress: values.UserManualAddress || null,
                                adharCardNumber: values.adharCardNumber,
                                profileImage: profileBase64 ? `data:image/jpeg;base64,${profileBase64}` : profileUri || null,
                            };

                            const res = await dispatch(updateUserProfileAction(payload));
                            console.log('Profile update response:', res);
                            setSubmitting(false);

                            if (res?.success === true) {
                                Toast.show({ type: "success", text1: "Profile Updated", text2: res?.message });
                            } else {
                                Toast.show({ type: "error", text1: "Update Failed", text2: res?.message });
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
                            <View style={{ gap: 4 }}>

                                {/* ─── Personal Information ─── */}
                                <View style={{
                                    backgroundColor: cardBg,
                                    borderRadius: 16, padding: 16, marginBottom: 16,
                                    borderWidth: 1, borderColor,
                                }}>
                                    <SectionHeader title="Personal Information" isDark={isDark} />

                                    <FieldLabel label="Full Name" isDark={isDark} />
                                    <InputField
                                        isDark={isDark}
                                        placeholder="Enter your name"
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                    />
                                    {touched.name && errors.name && <Text style={{ color: '#E0583D', fontSize: 12, marginBottom: 8 }}>{errors.name}</Text>}

                                    <FieldLabel label="Phone Number" isDark={isDark} />
                                    <InputField
                                        isDark={isDark}
                                        placeholder="10-digit phone number"
                                        keyboardType="phone-pad"
                                        value={values.phoneNumber}
                                        onChangeText={handleChange('phoneNumber')}
                                        onBlur={handleBlur('phoneNumber')}
                                        maxLength={10}
                                    />
                                    {touched.phoneNumber && errors.phoneNumber && <Text style={{ color: '#E0583D', fontSize: 12, marginBottom: 8 }}>{errors.phoneNumber}</Text>}

                                    <FieldLabel label="Email" isDark={isDark} />
                                    <InputField
                                        isDark={isDark}
                                        placeholder="Email address"
                                        keyboardType="email-address"
                                        value={values.email}
                                        editable={false}
                                        style={{ opacity: 0.5 }}
                                    />

                                    <FieldLabel label="Gender" isDark={isDark} />
                                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                                        {['male', 'female', 'other'].map((item) => (
                                            <TouchableOpacity
                                                key={item}
                                                onPress={() => setFieldValue('gender', item)}
                                                style={{
                                                    flex: 1, paddingVertical: 10, borderRadius: 10,
                                                    alignItems: 'center',
                                                    backgroundColor: values.gender === item ? '#E0583D' : (isDark ? '#2a2a2a' : '#f0f0f0'),
                                                    borderWidth: 1,
                                                    borderColor: values.gender === item ? '#E0583D' : (isDark ? '#333' : '#e0e0e0'),
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: 13, fontWeight: '600',
                                                    color: values.gender === item ? '#fff' : (isDark ? '#aaa' : '#555'),
                                                }}>
                                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <FieldLabel label="Date of Birth (YYYY-MM-DD)" isDark={isDark} />
                                    <InputField
                                        isDark={isDark}
                                        placeholder="YYYY-MM-DD"
                                        value={values.dateOfBirth}
                                        onChangeText={handleChange('dateOfBirth')}
                                        onBlur={handleBlur('dateOfBirth')}
                                    />
                                    {touched.dateOfBirth && errors.dateOfBirth && <Text style={{ color: '#E0583D', fontSize: 12, marginBottom: 8 }}>{errors.dateOfBirth}</Text>}
                                </View>

                                {/* ─── Location Details ─── */}
                                <View style={{
                                    backgroundColor: cardBg,
                                    borderRadius: 16, padding: 16, marginBottom: 16,
                                    borderWidth: 1, borderColor,
                                }}>
                                    <SectionHeader title="Location Details" isDark={isDark} />

                                    <FieldLabel label="Pin Code" isDark={isDark} />
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
                                        backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
                                        borderRadius: 12, borderWidth: 1,
                                        borderColor: isDark ? '#2e2e2e' : '#e8e8e8', marginBottom: 4,
                                    }}>
                                        <TextInput
                                            placeholderTextColor={isDark ? "#666" : "#aaa"}
                                            style={{
                                                flex: 1, paddingHorizontal: 14, paddingVertical: 12,
                                                fontSize: 14, color: isDark ? '#e0e0e0' : '#1a1a1a',
                                            }}
                                            placeholder="6-digit pin code"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            value={values.pinCode}
                                            onChangeText={handleChange('pinCode')}
                                            onBlur={() => { handleBlur('pinCode'); fetchPinDetails(values.pinCode, setFieldValue); }}
                                        />
                                        <Pressable
                                            onPress={() => getLocation(setFieldValue)}
                                            disabled={locationLoading}
                                            style={{ paddingHorizontal: 14, paddingVertical: 12 }}
                                        >
                                            {locationLoading
                                                ? <ActivityIndicator size="small" color="#E0583D" />
                                                : <Ionicons name="locate" size={20} color="#E0583D" />
                                            }
                                        </Pressable>
                                    </View>
                                    {touched.pinCode && errors.pinCode && <Text style={{ color: '#E0583D', fontSize: 12, marginBottom: 8 }}>{errors.pinCode}</Text>}

                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <View style={{ flex: 1 }}>
                                            <FieldLabel label="City" isDark={isDark} />
                                            <InputField
                                                isDark={isDark}
                                                placeholder="City"
                                                value={values.city}
                                                onChangeText={handleChange('city')}
                                                onBlur={handleBlur('city')}
                                                editable={false}
                                                style={{ opacity: 0.7 }}
                                            />
                                            {touched.city && errors.city && <Text style={{ color: '#E0583D', fontSize: 12 }}>{errors.city}</Text>}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <FieldLabel label="State" isDark={isDark} />
                                            <InputField
                                                isDark={isDark}
                                                placeholder="State"
                                                value={values.state}
                                                onChangeText={handleChange('state')}
                                                onBlur={handleBlur('state')}
                                                editable={false}
                                                style={{ opacity: 0.7 }}
                                            />
                                            {touched.state && errors.state && <Text style={{ color: '#E0583D', fontSize: 12 }}>{errors.state}</Text>}
                                        </View>
                                    </View>

                                    <FieldLabel label="Full Address (optional)" isDark={isDark} />
                                    <InputField
                                        isDark={isDark}
                                        placeholder="e.g. Flat 4B, Green Valley Apartments"
                                        value={values.UserManualAddress}
                                        onChangeText={handleChange('UserManualAddress')}
                                        onBlur={handleBlur('UserManualAddress')}
                                        multiline
                                        numberOfLines={2}
                                        style={{ minHeight: 52 }}
                                    />
                                </View>

                                {/* ─── Identity Verification ─── */}
                                <View style={{
                                    backgroundColor: cardBg,
                                    borderRadius: 16, padding: 16, marginBottom: 24,
                                    borderWidth: 1, borderColor,
                                }}>
                                    <SectionHeader title="Identity Verification" isDark={isDark} />

                                    <FieldLabel label="Aadhaar Card Number *" isDark={isDark} />
                                    <InputField
                                        isDark={isDark}
                                        placeholder="12-digit Aadhaar number"
                                        keyboardType="number-pad"
                                        maxLength={12}
                                        value={values.adharCardNumber}
                                        onChangeText={handleChange('adharCardNumber')}
                                        onBlur={handleBlur('adharCardNumber')}
                                        secureTextEntry={false}
                                    />
                                    {touched.adharCardNumber && errors.adharCardNumber
                                        ? <Text style={{ color: '#E0583D', fontSize: 12, marginBottom: 8 }}>{errors.adharCardNumber}</Text>
                                        : <Text style={{ color: isDark ? '#666' : '#aaa', fontSize: 11, marginBottom: 8 }}>
                                            Your Aadhaar number is stored securely and will never be shared. Please ensure that you provide accurate information.
                                        </Text>
                                    }
                                </View>

                                {/* Save Button */}
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    style={{
                                        backgroundColor: isSubmitting ? '#aaa' : '#E0583D',
                                        borderRadius: 14, paddingVertical: 15,
                                        alignItems: 'center', marginBottom: 40,
                                        shadowColor: '#E0583D', shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }}>
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditProfile;
