import React, { useState, useEffect } from 'react';
import {
	View,
	ImageBackground,
	Text,
	Image,
	StyleSheet,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
// import RNPickerSelect from 'react-native-picker-select';

const Home = () => {
	const [state, setState] = useState('Carregando...');
	const [city, setCity] = useState('Carregando...');

	const [currentPosition, setCurrentPosition] = useState<[number, number]>([
		0,
		0,
	]);

	const [isLoadingPosition, setIsLoadingPosition] = useState(true);

	const navigation = useNavigation();

	useEffect(() => {
		async function loadPosition() {
			const { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'Ooooops...',
					'Precisamos de sua permissão para obter a localização'
				);
				return;
			}

			const location = await Location.getCurrentPositionAsync();
			const { latitude, longitude } = location.coords;

			try {
				const response = await axios.get(
					`https://geocode.xyz/${latitude},${longitude}?json=1`
				);
				setCity(response.data.city);
				//the api sometimes returns the state as BR, so ít's better not to set it
				//setState(response.data.state);
				setState('');
			} catch (error) {
				setCity('');
				setState('');
				console.log(error);
			} finally {
				setCurrentPosition([latitude, longitude]);
				setIsLoadingPosition(false);
			}
		}

		loadPosition();
	}, []);

	function handleNavigationToPoints() {
		navigation.navigate('Points', {
			state,
			city,
		});
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ImageBackground
				source={require('../../assets/home-background.png')}
				style={styles.container}
				imageStyle={{ width: 274, height: 368 }}
			>
				<View style={styles.main}>
					<Image source={require('../../assets/logo.png')} />

					<View>
						<Text style={styles.title}>
							Seu marketplace de coleta de resíduos
						</Text>
						<Text style={styles.description}>
							Ajudamos pessoas a encontrarem pontos de coleta de
							forma eficiente.
						</Text>
					</View>
				</View>

				<View style={styles.footer}>
					<TextInput
						style={[
							styles.input,
							isLoadingPosition ? styles.disabled : null,
						]}
						placeholder="Digite a UF"
						value={state}
						onChangeText={setState}
						maxLength={2}
						autoCapitalize="characters"
						autoCorrect={false}
						editable={!isLoadingPosition}
					></TextInput>
					<TextInput
						style={[
							styles.input,
							isLoadingPosition ? styles.disabled : null,
						]}
						placeholder="Digite a cidade"
						value={city}
						onChangeText={setCity}
						autoCorrect={false}
						editable={!isLoadingPosition}
					></TextInput>
					<RectButton
						style={styles.button}
						onPress={handleNavigationToPoints}
					>
						<View style={styles.buttonIcon}>
							<Icon name="arrow-right" color="#fff" size={24} />
						</View>
						<Text style={styles.buttonText}>
							<Text>Entrar</Text>
						</Text>
					</RectButton>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 32,
	},

	main: {
		flex: 1,
		justifyContent: 'center',
	},

	title: {
		color: '#322153',
		fontSize: 32,
		fontFamily: 'Ubuntu_700Bold',
		maxWidth: 260,
		marginTop: 64,
	},

	description: {
		color: '#6C6C80',
		fontSize: 16,
		marginTop: 16,
		fontFamily: 'Roboto_400Regular',
		maxWidth: 260,
		lineHeight: 24,
	},

	footer: {},

	select: {},

	input: {
		height: 60,
		backgroundColor: '#FFF',
		borderRadius: 10,
		marginBottom: 8,
		paddingHorizontal: 24,
		fontSize: 16,
	},

	button: {
		backgroundColor: '#34CB79',
		height: 60,
		flexDirection: 'row',
		borderRadius: 10,
		overflow: 'hidden',
		alignItems: 'center',
		marginTop: 8,
	},

	buttonIcon: {
		height: 60,
		width: 60,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
	},

	buttonText: {
		flex: 1,
		justifyContent: 'center',
		textAlign: 'center',
		color: '#FFF',
		fontFamily: 'Roboto_500Medium',
		fontSize: 16,
	},

	disabled: {
		backgroundColor: '#dedede',
	},
});

export default Home;
