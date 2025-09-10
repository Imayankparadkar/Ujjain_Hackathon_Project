import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { FileText, Users, AlertTriangle, Scale, Clock, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Terms of Service</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Guidelines and conditions for using SmartKumbh platform during your spiritual journey
          </p>
          <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4">
            <Scale className="h-6 w-6" />
            <span className="text-lg font-semibold">Effective Date: December 25, 2024</span>
          </div>
        </div>
      </section>

      {/* Terms Overview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Agreement Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              By using SmartKumbh, you agree to these terms which ensure safety and proper conduct during the sacred Kumbh Mela
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">User Rights</h3>
              <p className="text-gray-600 text-base leading-relaxed">Access to platform services and safety features during your pilgrimage</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Responsibilities</h3>
              <p className="text-gray-600 text-base leading-relaxed">Your obligations for safe and respectful use of our services</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <AlertTriangle className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Important Notices</h3>
              <p className="text-gray-600 text-base leading-relaxed">Key limitations and disclaimers for platform usage</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Terms Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            
            {/* Acceptance of Terms */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-4" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    By accessing or using the SmartKumbh platform, mobile application, or any related services (collectively, the "Services"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
                    <h4 className="font-bold text-gray-800 mb-2">Important Notice</h4>
                    <p className="text-gray-600">If you do not agree to these terms, please do not use our Services. Your continued use of the platform constitutes acceptance of any updates to these terms.</p>
                  </div>
                  
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      <span>You must be at least 13 years old to use this service independently</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      <span>Minors under 18 should use this service under adult supervision</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      <span>You agree to provide accurate and complete information when registering</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Use of Services */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Users className="h-8 w-8 text-green-600 mr-4" />
                  Permitted Use of Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">You May Use Our Services To:</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Navigate safely through Kumbh Mela grounds using our mapping and routing features</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Access real-time safety alerts and crowd information</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Report and search for lost persons or items through our digital registry</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Participate in spiritual events and access live streaming of ceremonies</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Generate and use QR codes for identification and emergency purposes</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Contact support services and emergency helplines</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Prohibited Activities:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-red-800 mb-3">Security Violations</h5>
                        <ul className="space-y-2 text-red-700 text-sm">
                          <li>• Attempting to hack or compromise system security</li>
                          <li>• Creating false emergency reports or alerts</li>
                          <li>• Interfering with platform operations</li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-red-800 mb-3">Misuse of Information</h5>
                        <ul className="space-y-2 text-red-700 text-sm">
                          <li>• Sharing false or misleading information</li>
                          <li>• Using others' personal information improperly</li>
                          <li>• Commercial use without authorization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Services */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-red-50 to-pink-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mr-4" />
                  Emergency Services Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-6">
                  <div className="bg-red-50 border-2 border-red-200 p-8 rounded-2xl">
                    <h4 className="text-xl font-bold text-red-800 mb-4">Important Emergency Notice</h4>
                    <p className="text-red-700 leading-relaxed text-lg">
                      While SmartKumbh provides emergency contact features and safety alerts, it is NOT a replacement for official emergency services. In life-threatening situations, immediately contact local emergency services (Police: 100, Medical: 108, Fire: 101).
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Platform Limitations</h4>
                        <p className="text-gray-600">Our services depend on internet connectivity, device functionality, and system availability</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">User Responsibility</h4>
                        <p className="text-gray-600">Always carry alternative emergency contact methods and follow official safety guidelines</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Accuracy Disclaimer</h4>
                        <p className="text-gray-600">While we strive for accuracy, information may not always be complete or up-to-date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Shield className="h-8 w-8 text-purple-600 mr-4" />
                  User Accounts and Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Account Security</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>You are responsible for maintaining account confidentiality</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Notify us immediately of any unauthorized access</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Keep your contact information updated for safety purposes</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Use accurate information in emergency contact fields</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Data Accuracy</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Provide truthful and accurate personal information</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Update medical information if relevant to safety</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Report lost and found items accurately</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Verify QR code information for emergency use</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liability and Disclaimers */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-yellow-50 to-amber-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Scale className="h-8 w-8 text-yellow-600 mr-4" />
                  Liability and Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Service Availability</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      SmartKumbh services are provided "as is" and "as available." We do not guarantee uninterrupted access or error-free operation, especially during high-traffic periods of the Kumbh Mela.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
                      <h5 className="font-bold text-yellow-800 mb-2">Network Dependencies</h5>
                      <p className="text-yellow-700">Our services depend on mobile networks, internet connectivity, and third-party services which may experience disruptions during large gatherings.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Limitation of Liability</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-gray-800 mb-3">What We're Not Liable For</h5>
                        <ul className="space-y-2 text-gray-600 text-sm">
                          <li>• Network outages or service interruptions</li>
                          <li>• Actions taken by third parties</li>
                          <li>• Loss of data due to device issues</li>
                          <li>• Decisions made based on platform information</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-gray-800 mb-3">User Responsibility</h5>
                        <ul className="space-y-2 text-gray-600 text-sm">
                          <li>• Following official safety guidelines</li>
                          <li>• Verifying information before acting</li>
                          <li>• Maintaining device battery and connectivity</li>
                          <li>• Having backup emergency plans</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modifications and Termination */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Clock className="h-8 w-8 text-indigo-600 mr-4" />
                  Modifications and Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Changes to Terms</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We may update these Terms of Service periodically. Significant changes will be communicated through the app or email. Continued use after changes constitutes acceptance of new terms.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Service Termination</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">By You</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Delete your account anytime</li>
                          <li>• Stop using the services</li>
                          <li>• Request data deletion</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">By Us</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• For violation of terms</li>
                          <li>• For misuse of emergency features</li>
                          <li>• At end of Kumbh Mela period</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Questions About These Terms?</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  If you have any questions about these Terms of Service or need clarification on any provision, please contact our legal team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-orange-600">legal@smartkumbh.gov.in</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-orange-600">+91 1800-KUMBH-LAW</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <p className="font-semibold text-gray-800">Office Hours</p>
                    <p className="text-orange-600">24/7 During Kumbh Mela</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}