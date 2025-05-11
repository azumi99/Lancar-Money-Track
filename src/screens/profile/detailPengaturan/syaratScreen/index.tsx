import { TextHeading } from '@components/textHeading';
import { Button, Text, View, ScrollView, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, Linking } from 'react-native';


const TermsAndConditions = () => {
    return (
        <ScrollView style={styles.container} >
            <View style={styles.header}>
                <Text style={styles.title}>Terms and Conditions</Text>
                <Text style={styles.date}>Last updated: April 16, 2025</Text>
                <Text style={styles.introduction}>
                    Please read these terms and conditions carefully before using Our Service.
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Interpretation and Definitions</Text>
            <Text style={styles.sectionSubtitle}>Interpretation</Text>
            <Text style={styles.sectionText}>
                The words of which the initial letter is capitalized have meanings defined under the following conditions.
                The following definitions shall have the same meaning regardless of whether they appear in singular or plural.
            </Text>

            <Text style={styles.sectionSubtitle}>Definitions</Text>
            <Text style={styles.sectionText}>For the purposes of these Terms and Conditions:</Text>
            <Text style={styles.definitionText}><TextHeading>Application</TextHeading> means the software program provided by the Company downloaded by You on any electronic device, named Lancar.</Text>
            <Text style={styles.definitionText}><TextHeading>Application Store</TextHeading> means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.</Text>
            <Text style={styles.definitionText}><TextHeading>Affiliate</TextHeading> means an entity that controls, is controlled by, or is under common control with a party.</Text>
            <Text style={styles.definitionText}><TextHeading>Country</TextHeading> refers to: Indonesia.</Text>
            <Text style={styles.definitionText}>
                <TextHeading>Terms and Conditions</TextHeading> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the{' '}
                <Text
                    style={{ color: 'blue' }}
                    onPress={() => Linking.openURL('https://www.termsfeed.com/terms-conditions-generator/')}
                >
                    Terms and Conditions Generator
                </Text>.
            </Text>

            <Text style={styles.sectionTitle}>Acknowledgment</Text>
            <Text style={styles.sectionText}>
                These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company.
            </Text>
            <Text style={styles.sectionText}>
                By accessing or using the Service, You agree to be bound by these Terms and Conditions.
            </Text>

            <Text style={styles.sectionTitle}>Links to Other Websites</Text>
            <Text style={styles.sectionText}>
                Our Service may contain links to third-party websites or services that are not owned or controlled by the Company.
            </Text>
            <Text style={styles.sectionText}>
                We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or services that You visit.
            </Text>

            <Text style={styles.sectionTitle}>Termination</Text>
            <Text style={styles.sectionText}>
                We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever.
            </Text>

            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            <Text style={styles.sectionText}>
                Notwithstanding any damages that You might incur, the entire liability of the Company shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything.
            </Text>

            <Text style={styles.sectionTitle}>Governing Law</Text>
            <Text style={styles.sectionText}>
                The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service.
            </Text>

            <Text style={styles.sectionTitle}>Changes to These Terms and Conditions</Text>
            <Text style={styles.sectionText}>
                We reserve the right, at Our sole discretion, to modify or replace these Terms at any time.
            </Text>

            <Button
                onPress={() => Linking.openURL('mailto:lancarapak@gmail.com')}
                style={styles.contactButton}
            >
                <ButtonText>Contact Us</ButtonText>
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    introduction: {
        fontSize: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    sectionSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
    sectionText: {
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5,
    },
    definitionText: {
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 5,
    },
    contactButton: {
        marginTop: 30,
        backgroundColor: '#FF7043',
        padding: 10,
        borderRadius: 5,
        marginBottom: 50,
        alignItems: 'center',
    },
});

export { TermsAndConditions };
