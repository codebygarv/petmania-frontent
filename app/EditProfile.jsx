import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { getUserDetailsAction, updateUserProfileAction } from "@/redux/actions/userActions";
import BackButton from "@/components/BackButton";
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import Toast from "react-native-toast-message";

const EditProfile = () => {
    const dispatch = useDispatch();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const [profileUri, setProfileUri] = useState(null);
    const [profileBase64, setProfileBase64] = useState(null);

    const [aadharFrontUri, setAadharFrontUri] = useState(null);
    const [aadharFrontBase64, setAadharFrontBase64] = useState(null);

    const [aadharBackUri, setAadharBackUri] = useState(null);
    const [aadharBackBase64, setAadharBackBase64] = useState(null);

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
    });

    const pickImage = async (type) => {
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
        } else if (type === "aadharFront") {
            setAadharFrontUri(uri);
            setAadharFrontBase64(base64);
        } else if (type === "aadharBack") {
            setAadharBackUri(uri);
            setAadharBackBase64(base64);
        }
    };


    const fetchUserDetails = async () => {
        const res = await dispatch(getUserDetailsAction());
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userInfoParsed = userInfo ? JSON.parse(userInfo) : null;

        if (res?.data) {
            const user = res.data.user;
            setInitialValues({
                name: user?.name || '',
                phoneNumber: user?.phoneNumber || '',
                email: user?.email || '',
                gender: user?.Gender?.toLowerCase() || 'male',
                dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
                pinCode: user?.pinCode || '',
                city: user?.city || '',
                state: user?.state || '',
                UserManualAddress: user?.UserManualAddress || user?.userManualAddress || '',
            });
            if (userInfoParsed?.name) {
                setInitialValues((prev) => ({ ...prev, name: userInfoParsed.name }));
            }
            if (user.profileImage) {
                setProfileUri(user.profileImage);
            }
            if (userInfoParsed?.avatar) {
                setProfileUri(userInfoParsed?.avatar);
            }
            if (user.adharCardFrontImage) {
                setAadharFrontUri(user.adharCardFrontImage);
            }
            if (user.adharCardBackImage) {
                setAadharBackUri(user.adharCardBackImage);
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchPinDetails = async (pin, setFieldValue) => {
        if (!/^[0-9]{6}$/.test(pin)) return;
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await res.json();
            if (data && data[0]?.Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length) {
                const po = data[0].PostOffice[0];
                const city = po.District || po.Name || '';
                const state = po.State || '';
                setFieldValue('city', city);
                setFieldValue('state', state);
            } else {
                setFieldValue('city', '');
                setFieldValue('state', '');
            }
        } catch (err) {
            console.warn('Failed to fetch pin details', err);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        phoneNumber: Yup.string()
            .required('Phone number is required')
            .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
        gender: Yup.string().oneOf(['male', 'female', 'other']),
        dateOfBirth: Yup.string()
            .required('Date of birth is required')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
            .test('dob', 'Date must be in the past', (value) => {
                if (!value) return false;
                const d = new Date(value);
                return d.toString() !== 'Invalid Date' && d <= new Date();
            }),
        pinCode: Yup.string().required('Pin code is required').matches(/^\d{6}$/, 'Pin code must be 6 digits'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        UserManualAddress: Yup.string().notRequired(),
    });

    return (
        <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
            <View className="px-4 pt-6">
                <View className="flex flex-row items-center mb-4">
                    <Pressable className="p-2">
                        <BackButton />
                    </Pressable>
                    <Text className="text-lg  font-bold color-textPrimary ml-2">Edit Profile</Text>
                </View>

                {/* Profile Image */}
                <View className="items-center mt-1">
                    <TouchableOpacity onPress={() => pickImage("profile")} className="items-center">
                        {profileUri ? (
                            <Image source={{ uri: profileUri }} className="w-28 h-28 rounded-full" />
                        ) : (
                            <View className="w-28 h-28 rounded-full bg-backgroundSecondary items-center justify-center">
                                <Text className="color-textPrimary">No Photo</Text>
                            </View>
                        )}
                        <Text className="mt-2 color-textPrimary">Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const GenderValue =
                            values.gender === "male" ? "Male" :
                                values.gender === "female" ? "Female" :
                                    "Other";

                        const payload = {
                            name: values.name,
                            phoneNumber: values.phoneNumber,
                            Gender: GenderValue,
                            dateOfBirth: values.dateOfBirth,
                            pinCode: values.pinCode,
                            city: values.city,
                            state: values.state,
                            UserManualAddress: values.UserManualAddress || null,
                            profileImage: profileBase64 ? `data:image/jpeg;base64,${profileBase64}` : profileUri || null,
                            adharCardFrontImage: aadharFrontBase64 ? `data:image/jpeg;base64,${aadharFrontBase64}` : aadharFrontUri || null,
                            adharCardBackImage: aadharBackBase64 ? `data:image/jpeg;base64,${aadharBackBase64}` : aadharBackUri || null,
                        };
                        const res = await dispatch(updateUserProfileAction(payload));
                        console.log('Profile update response:', res);
                        setSubmitting(false);

                        if(res?.success === true){
                            Toast.show({
                                type: "success",
                                text1: "Profile Updated",
                                text2: res?.message,
                            });
                        } else {
                            Toast.show({
                                type: "error",
                                text1: "Update Failed",
                                text2: res?.message,
                            });
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
                        <View className="px-4 mt-6 gap-2">
                            <Text className="text-sm color-textPrimary mb-1 text-extraBold">Full Name</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-1"
                                placeholder="Enter your name"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                            />
                            {touched.name && errors.name && <Text className="text-red-500 mb-2">{errors.name}</Text>}

                            <Text className="text-sm color-textPrimary mb-1">Phone Number</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-1"
                                placeholder="Enter phone number"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                keyboardType="phone-pad"
                                value={values.phoneNumber}
                                onChangeText={handleChange('phoneNumber')}
                                onBlur={handleBlur('phoneNumber')}
                            />
                            {touched.phoneNumber && errors.phoneNumber && <Text className="text-red-500 mb-2">{errors.phoneNumber}</Text>}

                            <Text className="text-sm color-textPrimary mb-1">Email</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-3"
                                placeholder="Enter email"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                keyboardType="email-address"
                                value={values.email}
                                editable={false}
                            />

                            <Text className="text-sm color-textPrimary mb-2">Gender</Text>
                            <View className="flex-row space-x-2 mb-4">
                                {['male', 'female', 'other'].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        className={`px-3 mr-2 py-2 rounded-md border ${values.gender === item ? 'bg-buttonPrimary border-buttonPrimary' : 'bg-backgroundSecondary border-gray-300'}`}
                                        onPress={() => setFieldValue('gender', item)}
                                    >
                                        <Text className={`${values.gender === item ? 'text-white' : 'color-textPrimary'} text-sm`}>{item.toUpperCase()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text className="text-sm color-textPrimary mb-1">Date of Birth (YYYY-MM-DD)</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-1"
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                value={values.dateOfBirth}
                                onChangeText={handleChange('dateOfBirth')}
                                onBlur={handleBlur('dateOfBirth')}
                            />
                            {touched.dateOfBirth && errors.dateOfBirth && <Text className="text-red-500 mb-2">{errors.dateOfBirth}</Text>}

                            <Text className="text-sm color-textPrimary mb-1">Pin Code</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-1"
                                placeholder="Enter pin code"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                keyboardType="number-pad"
                                value={values.pinCode}
                                onChangeText={handleChange('pinCode')}
                                onBlur={() => { handleBlur('pinCode'); fetchPinDetails(values.pinCode, setFieldValue); }}
                            />
                            {touched.pinCode && errors.pinCode && <Text className="text-red-500 mb-2">{errors.pinCode}</Text>}

                            <Text className="text-sm color-textPrimary mb-1">City</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-1"
                                placeholder="Enter city"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                value={values.city}
                                onChangeText={handleChange('city')}
                                onBlur={handleBlur('city')}
                                editable={false}
                            />
                            {touched.city && errors.city && <Text className="text-red-500 mb-2">{errors.city}</Text>}

                            <Text className="text-sm color-textPrimary mb-1">State</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-1"
                                placeholder="Enter state"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                value={values.state}
                                onChangeText={handleChange('state')}
                                onBlur={handleBlur('state')}
                                editable={false}
                            />
                            {touched.state && errors.state && <Text className="text-red-500 mb-2">{errors.state}</Text>}

                            <Text className="text-sm color-textPrimary mb-1">Manual Address (optional)</Text>
                            <TextInput
                                className="bg-backgroundSecondary rounded-xl px-3 py-2 mb-3"
                                placeholder="Enter address"
                                placeholderTextColor={isDark ? "#888" : "#1a1a1aff"}
                                color={isDark ? "#e0e0e0ff" : "#1a1a1aff"}
                                value={values.UserManualAddress}
                                onChangeText={handleChange('UserManualAddress')}
                                onBlur={handleBlur('UserManualAddress')}
                            />

                            {/* Aadhaar Upload */}
                            <Text className="text-base font-semibold color-textPrimary mb-3">Aadhaar Verification</Text>

                            <View className="flex-row justify-between space-x-3 mb-4 gap-4">
                                <TouchableOpacity
                                    className="flex-1 h-36 bg-loginSigcnupImageBg rounded-md items-center justify-center"
                                    onPress={() => pickImage("aadharFront")}
                                >
                                    {aadharFrontUri ? (
                                        <Image source={{ uri: aadharFrontUri }} className="w-full h-full rounded-md" />
                                    ) : (
                                        <Text className="color-textPrimary">Upload Front</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 h-36 bg-loginSigcnupImageBg rounded-md items-center justify-center"
                                    onPress={() => pickImage("aadharBack")}
                                >
                                    {aadharBackUri ? (
                                        <Image source={{ uri: aadharBackUri }} className="w-full h-full rounded-md" />
                                    ) : (
                                        <Text className="color-textPrimary">Upload Back</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Save Button */}
                            <TouchableOpacity className="bg-buttonPrimary py-3 rounded-md items-center" onPress={handleSubmit} disabled={isSubmitting}>
                                <Text className="text-white font-medium">{isSubmitting ? 'Saving...' : 'Save Changes'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </View>
        </ScrollView>
    );
};

export default EditProfile;
