import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Shield, Database, UserCheck, Eye, FileText, Clock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Privacy Policy</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Your privacy and data security are fundamental to our mission of serving pilgrims safely
          </p>
          <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-semibold">Last Updated: December 25, 2024</span>
          </div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SmartKumbh is committed to protecting the privacy and security of all pilgrims using our platform during the sacred Kumbh Mela
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Database className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Protection</h3>
              <p className="text-gray-600 text-base leading-relaxed">Advanced encryption and security measures protect all personal information</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <UserCheck className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">User Control</h3>
              <p className="text-gray-600 text-base leading-relaxed">You maintain full control over your personal data and privacy settings</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Eye className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Transparency</h3>
              <p className="text-gray-600 text-base leading-relaxed">Clear information about what data we collect and how it's used</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Privacy Policy Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            
            {/* Information We Collect */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-4" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Name, email address, phone number, and emergency contact details</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Medical information and allergies (only if voluntarily provided for safety purposes)</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Age, language preferences, and accessibility requirements</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Location Data</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>GPS location data for navigation and safety features (only when app is active)</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Check-in locations at spiritual events and facilities</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Usage Information</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>App usage patterns, feature interactions, and service preferences</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>QR code generation and scanning activities for identification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600 mr-4" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">Safety and Emergency Response</h4>
                      <p className="text-gray-600 leading-relaxed">To provide emergency assistance, locate missing persons, and ensure pilgrim safety during the Kumbh Mela</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">Navigation and Route Optimization</h4>
                      <p className="text-gray-600 leading-relaxed">To provide real-time navigation, crowd management, and personalized route recommendations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">Service Improvement</h4>
                      <p className="text-gray-600 leading-relaxed">To enhance our services, analyze usage patterns, and improve the overall pilgrim experience</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">Communication</h4>
                      <p className="text-gray-600 leading-relaxed">To send important safety alerts, event updates, and respond to your inquiries</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-red-50 to-pink-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Shield className="h-8 w-8 text-red-600 mr-4" />
                  Data Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
                      <h4 className="font-bold text-gray-800 mb-2">Emergency Situations</h4>
                      <p className="text-gray-600">In case of medical emergencies or safety threats, we may share necessary information with emergency services, medical personnel, or law enforcement</p>
                    </div>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-2xl">
                      <h4 className="font-bold text-gray-800 mb-2">Government Authorities</h4>
                      <p className="text-gray-600">When required by law or to comply with legal processes, court orders, or government regulations</p>
                    </div>
                    
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-2xl">
                      <h4 className="font-bold text-gray-800 mb-2">Service Providers</h4>
                      <p className="text-gray-600">With trusted service providers who assist in operating our platform, subject to strict confidentiality agreements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Database className="h-8 w-8 text-purple-600 mr-4" />
                  Data Security Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Technical Safeguards</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>End-to-end encryption for all data transmission</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Secure cloud storage with advanced access controls</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Regular security audits and vulnerability assessments</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Multi-factor authentication for admin access</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Administrative Safeguards</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Strict access controls and employee training</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Regular data backups and disaster recovery plans</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Incident response procedures for data breaches</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Compliance with industry security standards</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-amber-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Eye className="h-8 w-8 text-orange-600 mr-4" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Access Your Data</h4>
                        <p className="text-gray-600">Request a copy of all personal information we have about you</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Correct Your Data</h4>
                        <p className="text-gray-600">Update or correct any inaccurate personal information</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Delete Your Data</h4>
                        <p className="text-gray-600">Request deletion of your personal information (subject to legal requirements)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Restrict Processing</h4>
                        <p className="text-gray-600">Limit how we process your personal information</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Data Portability</h4>
                        <p className="text-gray-600">Receive your data in a structured, machine-readable format</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-gray-800">Opt-out</h4>
                        <p className="text-gray-600">Withdraw consent for certain data processing activities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Questions About Your Privacy?</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  If you have any questions about this Privacy Policy or how we handle your personal information, please contact our Data Protection Officer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-orange-600">privacy@smartkumbh.gov.in</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-orange-600">+91 1800-PRIVACY</p>
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