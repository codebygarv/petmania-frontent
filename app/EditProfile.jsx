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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailsAction, updateUserProfileAction } from "@/redux/actions/userActions";
import BackButton from "@/components/BackButton";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useColorScheme } from "nativewind";
import Toast from "react-native-toast-message";
import EditProfileSkeleton from "@/components/EditProfile/EditProfileSkeleton";
import { getColor } from "@/constants/color";

const SectionHeader = ({ title, isDark }) => (
    <View style={{ marginBottom: 12, marginTop: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: getColor("textPrimary", isDark), letterSpacing: 0.3 }}>
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
        placeholderTextColor={getColor("inputPlaceholder", isDark)}
        className="bg-backgroundSecondary text-textPrimary border border-border"
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

    const [adharFrontUri, setAdharFrontUri] = useState(null);
    const [adharFrontBase64, setAdharFrontBase64] = useState(null);
    const [adharBackUri, setAdharBackUri] = useState(null);
    const [adharBackBase64, setAdharBackBase64] = useState(null);

    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

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
        } else if (type === "adharFront") {
            setAdharFrontUri(uri);
            setAdharFrontBase64(base64);
        } else if (type === "adharBack") {
            setAdharBackUri(uri);
            setAdharBackBase64(base64);
        }
    };

    const fetchUserDetails = React.useCallback(async () => {
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
                if (u?.adharCardFrontImage) setAdharFrontUri(u.adharCardFrontImage);
                if (u?.adharCardBackImage) setAdharBackUri(u.adharCardBackImage);
            }
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => { fetchUserDetails(); }, [fetchUserDetails]);

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
        } catch (_error) {
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

    const bg = getColor("background", isDark);
    const cardBg = getColor("backgroundSecondary", isDark);
    const borderColor = getColor("border", isDark);
    const accentColor = getColor("accent", isDark);
    const textPrimaryColor = getColor("textPrimary", isDark);
    const textSecondaryColor = getColor("textSecondary", isDark);
    const inputPlaceholderColor = getColor("inputPlaceholder", isDark);
    const errorColor = getColor("error", isDark);
    const whiteColor = getColor("white", isDark);

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
                        <Text style={{ fontSize: 20, fontWeight: '700', color: textPrimaryColor, marginLeft: 10 }}>
                            Edit Profile
                        </Text>
                    </View>

                    {/* Verification Status Banner */}
                    {userInfo?.verificationStatus === "recheck_requested" || (userInfo?.verificationRejectReason && !(userInfo?.isAdharVerified || userInfo?.isAadhaarVerified)) ? (
                        <View
                            className="rounded-2xl p-4 mb-5 border"
                            style={{
                                backgroundColor: `${getColor("error", isDark)}15`,
                                borderColor: `${getColor("error", isDark)}50`,
                            }}
                        >
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="alert-circle" size={22} color={getColor("error", isDark)} />
                                <Text
                                    className="ml-2 text-sm font-bold flex-1"
                                    style={{ color: getColor("error", isDark) }}
                                >
                                    Action Required: Profile Re-check
                                </Text>
                            </View>
                            {userInfo?.verificationRejectReason && (
                                <View
                                    className="p-2.5 rounded-xl mb-2.5"
                                    style={{ backgroundColor: `${getColor("error", isDark)}20` }}
                                >
                                    <Text className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: getColor("error", isDark) }}>
                                        Admin Feedback:
                                    </Text>
                                    <Text
                                        className="text-xs leading-5 italic font-medium"
                                        style={{ color: textPrimaryColor }}
                                    >
                                        &ldquo;{userInfo.verificationRejectReason}&rdquo;
                                    </Text>
                                </View>
                            )}
                            <View className="flex-row items-center">
                                <Ionicons name="mail-outline" size={16} color={getColor("error", isDark)} />
                                <Text
                                    className="ml-2 text-xs flex-1 font-semibold"
                                    style={{ color: getColor("error", isDark) }}
                                >
                                    Please check your email for full instructions. Re-upload or edit your details below and tap &ldquo;Save Changes&rdquo; to resubmit for verification.
                                </Text>
                            </View>
                        </View>
                    ) : !userInfo?.isVerified ? (
                        <View
                            className="rounded-xl p-3 mb-5 flex-row items-center border"
                            style={{
                                backgroundColor: `${getColor("warning", isDark)}15`,
                                borderColor: `${getColor("warning", isDark)}40`,
                            }}
                        >
                            <Ionicons name="alert-circle" size={20} color={getColor("warning", isDark)} />
                            <Text
                                className="ml-2 text-xs flex-1"
                                style={{ color: getColor("warning", isDark) }}
                            >
                                Your email is not verified. Please verify your email to secure your account.
                            </Text>
                        </View>
                    ) : !(userInfo?.isAdharVerified || userInfo?.isAadhaarVerified) ? (
                        userInfo?.adharCardFrontImage ? (
                            <View
                                className="rounded-xl p-3 mb-5 flex-row items-center border"
                                style={{
                                    backgroundColor: `${getColor("warning", isDark)}15`,
                                    borderColor: `${getColor("warning", isDark)}40`,
                                }}
                            >
                                <Ionicons name="time-outline" size={20} color={getColor("warning", isDark)} />
                                <Text
                                    className="ml-2 text-xs flex-1"
                                    style={{ color: getColor("warning", isDark) }}
                                >
                                    Your Identity details are submitted and pending admin verification.
                                </Text>
                            </View>
                        ) : (
                            <View
                                className="rounded-xl p-3 mb-5 flex-row items-center border"
                                style={{
                                    backgroundColor: `${getColor("warning", isDark)}15`,
                                    borderColor: `${getColor("warning", isDark)}40`,
                                }}
                            >
                                <Ionicons name="alert-circle" size={20} color={getColor("warning", isDark)} />
                                <Text
                                    className="ml-2 text-xs flex-1"
                                    style={{ color: getColor("warning", isDark) }}
                                >
                                    Email verified. Please submit your Aadhaar details below to verify your identity.
                                </Text>
                            </View>
                        )
                    ) : (
                        <View
                            className="rounded-xl p-3 mb-5 flex-row items-center border"
                            style={{
                                backgroundColor: `${getColor("success", isDark)}15`,
                                borderColor: `${getColor("success", isDark)}40`,
                            }}
                        >
                            <Ionicons name="checkmark-circle" size={20} color={getColor("success", isDark)} />
                            <Text
                                className="ml-2 text-xs flex-1"
                                style={{ color: getColor("success", isDark) }}
                            >
                                {userInfo?.userVerified ? "Your profile is fully verified." : "Your Identity details are verified."}
                            </Text>
                        </View>
                    )}

                    {/* Profile Photo */}
                    <View style={{ alignItems: 'center', marginBottom: 28 }}>
                        <TouchableOpacity onPress={() => pickImage("profile")} style={{ position: 'relative' }}>
                            {profileUri ? (
                                <Image
                                    source={{ uri: profileUri }}
                                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: accentColor }}
                                />
                            ) : (
                                <View style={{
                                    width: 100, height: 100, borderRadius: 50,
                                    backgroundColor: cardBg,
                                    alignItems: 'center', justifyContent: 'center',
                                    borderWidth: 2, borderColor,
                                }}>
                                    <Ionicons name="person" size={38} color={inputPlaceholderColor} />
                                </View>
                            )}
                            <View style={{
                                position: 'absolute', bottom: 0, right: 0,
                                backgroundColor: accentColor, borderRadius: 14, padding: 5,
                                borderWidth: 2, borderColor: bg,
                            }}>
                                <Ionicons name="camera" size={14} color={whiteColor} />
                            </View>
                        </TouchableOpacity>
                        <Text style={{ marginTop: 8, fontSize: 13, color: textSecondaryColor }}>
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
                                adharCardFrontImage: adharFrontBase64 ? `data:image/jpeg;base64,${adharFrontBase64}` : adharFrontUri || null,
                                adharCardBackImage: adharBackBase64 ? `data:image/jpeg;base64,${adharBackBase64}` : adharBackUri || null,
                            };

                            const res = await dispatch(updateUserProfileAction(payload));
                            console.log('Profile update response:', res);
                            setSubmitting(false);

                            if (res?.success === true) {
                                Toast.show({ type: "success", text1: "Profile Updated", text2: "Submitted for verification" });
                                dispatch(getUserDetailsAction());
                            } else {
                                Toast.show({ type: "error", text1: "Update Failed", text2: res?.message || "Failed to update profile" });
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
                                    {touched.name && errors.name && <Text style={{ color: errorColor, fontSize: 12, marginBottom: 8 }}>{errors.name}</Text>}

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
                                    {touched.phoneNumber && errors.phoneNumber && <Text style={{ color: errorColor, fontSize: 12, marginBottom: 8 }}>{errors.phoneNumber}</Text>}

                                    <FieldLabel label="Email" isDark={isDark} />
                                    <View className="relative justify-center">
                                        <InputField
                                            isDark={isDark}
                                            placeholder="Email address"
                                            keyboardType="email-address"
                                            value={values.email}
                                            editable={false}
                                            style={{ opacity: 0.85, paddingRight: userInfo?.isVerified ? 95 : 14 }}
                                        />
                                        {userInfo?.isVerified && (
                                            <View
                                                className="absolute right-3 flex-row items-center px-2 py-1 rounded-full border"
                                                style={{
                                                    backgroundColor: `${getColor("success", isDark)}15`,
                                                    borderColor: `${getColor("success", isDark)}40`,
                                                    top: 9,
                                                }}
                                            >
                                                <Ionicons name="checkmark-circle" size={14} color={getColor("success", isDark)} />
                                                <Text
                                                    className="ml-1 text-xs font-semibold"
                                                    style={{ color: getColor("success", isDark) }}
                                                >
                                                    Verified
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <FieldLabel label="Gender" isDark={isDark} />
                                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                                        {['male', 'female', 'other'].map((item) => (
                                             <TouchableOpacity
                                                key={item}
                                                onPress={() => setFieldValue('gender', item)}
                                                style={{
                                                    flex: 1, paddingVertical: 10, borderRadius: 10,
                                                    alignItems: 'center',
                                                    backgroundColor: values.gender === item ? accentColor : cardBg,
                                                    borderWidth: 1,
                                                    borderColor: values.gender === item ? accentColor : borderColor,
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: 13, fontWeight: '600',
                                                    color: values.gender === item ? whiteColor : textSecondaryColor,
                                                }}>
                                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <FieldLabel label="Date of Birth" isDark={isDark} />
                                    <Pressable
                                        onPress={() => setShowDatePicker(true)}
                                        className="bg-backgroundSecondary border border-border"
                                        style={{
                                            borderRadius: 12,
                                            paddingHorizontal: 14,
                                            paddingVertical: 12,
                                            marginBottom: 4,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            color: values.dateOfBirth ? textPrimaryColor : inputPlaceholderColor,
                                            flex: 1
                                        }}>
                                            {values.dateOfBirth || "Select your birthday"}
                                        </Text>
                                        <Ionicons name="calendar-outline" size={20} color={textSecondaryColor} />
                                    </Pressable>

                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={values.dateOfBirth ? new Date(values.dateOfBirth) : new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, selectedDate) => {
                                                if (event.type === 'dismissed') {
                                                    setShowDatePicker(false);
                                                    return;
                                                }
                                                const currentDate = selectedDate || new Date();
                                                setShowDatePicker(Platform.OS === 'ios');
                                                const year = currentDate.getFullYear();
                                                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                                                const day = String(currentDate.getDate()).padStart(2, '0');
                                                setFieldValue('dateOfBirth', `${year}-${month}-${day}`);
                                            }}
                                            maximumDate={new Date()}
                                        />
                                    )}
                                    {touched.dateOfBirth && errors.dateOfBirth && <Text style={{ color: errorColor, fontSize: 12, marginBottom: 8 }}>{errors.dateOfBirth}</Text>}
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
                                        backgroundColor: cardBg,
                                        borderRadius: 12, borderWidth: 1,
                                        borderColor, marginBottom: 4,
                                    }}>
                                        <TextInput
                                            placeholderTextColor={inputPlaceholderColor}
                                            style={{
                                                flex: 1, paddingHorizontal: 14, paddingVertical: 12,
                                                fontSize: 14, color: textPrimaryColor,
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
                                                ? <ActivityIndicator size="small" color={accentColor} />
                                                : <Ionicons name="locate" size={20} color={accentColor} />
                                            }
                                        </Pressable>
                                    </View>
                                    {touched.pinCode && errors.pinCode && <Text style={{ color: errorColor, fontSize: 12, marginBottom: 8 }}>{errors.pinCode}</Text>}

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
                                            {touched.city && errors.city && <Text style={{ color: errorColor, fontSize: 12 }}>{errors.city}</Text>}
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
                                            {touched.state && errors.state && <Text style={{ color: errorColor, fontSize: 12 }}>{errors.state}</Text>}
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
                                        ? <Text style={{ color: errorColor, fontSize: 12, marginBottom: 8 }}>{errors.adharCardNumber}</Text>
                                        : <Text style={{ color: textSecondaryColor, fontSize: 11, marginBottom: 8 }}>
                                            Your Aadhaar number is stored securely and will never be shared. Please ensure accurate information.
                                        </Text>
                                    }

                                    {/* Aadhaar Front Card Image */}
                                    <View style={{ marginTop: 8 }}>
                                        <FieldLabel label="Aadhaar Front Side Photo" isDark={isDark} />
                                        <TouchableOpacity
                                            onPress={() => pickImage("adharFront")}
                                            style={{
                                                borderWidth: 1.5,
                                                borderStyle: 'dashed',
                                                borderColor: adharFrontUri ? accentColor : borderColor,
                                                borderRadius: 12,
                                                padding: 8,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: cardBg,
                                                minHeight: 100,
                                                marginBottom: 10,
                                            }}
                                        >
                                            {adharFrontUri ? (
                                                <Image
                                                    source={{ uri: adharFrontUri }}
                                                    style={{ width: '100%', height: 130, borderRadius: 8 }}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={{ alignItems: 'center', gap: 4, paddingVertical: 12 }}>
                                                    <Ionicons name="cloud-upload-outline" size={26} color={accentColor} />
                                                    <Text style={{ color: textSecondaryColor, fontSize: 12, fontWeight: '500' }}>
                                                        Upload Front Side of Aadhaar
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    {/* Aadhaar Back Card Image */}
                                    <View style={{ marginTop: 4 }}>
                                        <FieldLabel label="Aadhaar Back Side Photo" isDark={isDark} />
                                        <TouchableOpacity
                                            onPress={() => pickImage("adharBack")}
                                            style={{
                                                borderWidth: 1.5,
                                                borderStyle: 'dashed',
                                                borderColor: adharBackUri ? accentColor : borderColor,
                                                borderRadius: 12,
                                                padding: 8,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: cardBg,
                                                minHeight: 100,
                                                marginBottom: 4,
                                            }}
                                        >
                                            {adharBackUri ? (
                                                <Image
                                                    source={{ uri: adharBackUri }}
                                                    style={{ width: '100%', height: 130, borderRadius: 8 }}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={{ alignItems: 'center', gap: 4, paddingVertical: 12 }}>
                                                    <Ionicons name="cloud-upload-outline" size={26} color={accentColor} />
                                                    <Text style={{ color: textSecondaryColor, fontSize: 12, fontWeight: '500' }}>
                                                        Upload Back Side of Aadhaar
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Save Button */}
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    style={{
                                        backgroundColor: isSubmitting ? getColor("buttonDisabled", isDark) : accentColor,
                                        borderRadius: 14, paddingVertical: 15,
                                        alignItems: 'center', marginBottom: 40,
                                        shadowColor: accentColor, shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
                                    }}
                                >
                                    <Text style={{ color: whiteColor, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }}>
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
