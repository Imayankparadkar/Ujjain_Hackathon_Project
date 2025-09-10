import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Building, FileText, Shield, Users, MapPin, Phone } from "lucide-react";

export default function GovernmentGuidelinesPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Government Guidelines</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Official regulations and guidelines for a safe and spiritual Kumbh Mela experience
          </p>
          <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4">
            <Building className="h-6 w-6" />
            <span className="text-lg font-semibold">Ministry of Culture, Government of India</span>
          </div>
        </div>
      </section>

      {/* Guidelines Overview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Official Compliance Framework</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SmartKumbh operates under the regulatory framework established by Government of India for digital services during Kumbh Mela
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Building className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Digital India Initiative</h3>
              <p className="text-gray-600 text-base leading-relaxed">Compliance with national digitization and e-governance standards</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Protection Laws</h3>
              <p className="text-gray-600 text-base leading-relaxed">Adherence to DPDP Act 2023 and other data protection regulations</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Accessibility Standards</h3>
              <p className="text-gray-600 text-base leading-relaxed">WCAG 2.1 compliance for inclusive access to all pilgrims</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Guidelines Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            
            {/* Regulatory Framework */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Building className="h-8 w-8 text-blue-600 mr-4" />
                  Regulatory Framework and Authorization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Government Authorization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Authorized by</h5>
                        <ul className="space-y-2 text-blue-700">
                          <li>• Ministry of Culture, Government of India</li>
                          <li>• Madhya Pradesh State Government</li>
                          <li>• Ujjain District Administration</li>
                          <li>• Kumbh Mela Authority</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-3">Compliance Certifications</h5>
                        <ul className="space-y-2 text-green-700">
                          <li>• ISO 27001 Information Security</li>
                          <li>• STQC (GOI) Digital Security Audit</li>
                          <li>• WCAG 2.1 Accessibility Compliance</li>
                          <li>• Digital India Quality Standards</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Legal Framework</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Information Technology Act, 2000:</strong> Governing digital services and electronic governance</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Digital Personal Data Protection Act, 2023:</strong> Data protection and privacy compliance</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Rights of Persons with Disabilities Act, 2016:</strong> Accessibility and inclusive design</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Disaster Management Act, 2005:</strong> Emergency response and crowd management protocols</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection Compliance */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Shield className="h-8 w-8 text-green-600 mr-4" />
                  Data Protection and Privacy Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">DPDP Act 2023 Compliance</h4>
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-2xl mb-6">
                      <p className="text-green-700 leading-relaxed">
                        SmartKumbh fully complies with the Digital Personal Data Protection Act, 2023, ensuring that all personal data collected from pilgrims is processed lawfully, fairly, and transparently.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Data Collection Principles</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Purpose limitation - data collected only for stated purposes</li>
                          <li>• Data minimization - only necessary data is collected</li>
                          <li>• Accuracy - mechanisms to ensure data accuracy</li>
                          <li>• Storage limitation - data retention only as needed</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">User Rights Protection</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Right to information about data processing</li>
                          <li>• Right to correction and erasure of data</li>
                          <li>• Right to grievance redressal</li>
                          <li>• Right to nominate in case of death or incapacity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Cross-Border Data Transfer</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      All pilgrim data is stored and processed within India, in compliance with data localization requirements. No personal data is transferred outside Indian territory without explicit consent and regulatory approval.
                    </p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
                      <h5 className="font-bold text-yellow-800 mb-2">Data Localization Compliance</h5>
                      <p className="text-yellow-700">Servers hosted in MEITY-approved data centers within India with 24/7 monitoring and security controls.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Standards */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Users className="h-8 w-8 text-purple-600 mr-4" />
                  Accessibility and Inclusive Design Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">WCAG 2.1 Level AA Compliance</h4>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      SmartKumbh platform is designed to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, ensuring equal access for all pilgrims regardless of their abilities.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-purple-800 mb-3">Visual Accessibility</h5>
                        <ul className="space-y-2 text-purple-700 text-sm">
                          <li>• High contrast color schemes</li>
                          <li>• Scalable fonts and text sizing</li>
                          <li>• Screen reader compatibility</li>
                          <li>• Alternative text for images</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Motor Accessibility</h5>
                        <ul className="space-y-2 text-blue-700 text-sm">
                          <li>• Keyboard navigation support</li>
                          <li>• Large touch targets</li>
                          <li>• Voice command integration</li>
                          <li>• Gesture alternatives</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-3">Cognitive Accessibility</h5>
                        <ul className="space-y-2 text-green-700 text-sm">
                          <li>• Simple, clear language</li>
                          <li>• Consistent navigation</li>
                          <li>• Error prevention and correction</li>
                          <li>• Time-flexible interactions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Language and Cultural Accessibility</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Multi-language Support</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Hindi and English as primary languages</li>
                          <li>• Regional language support (12 languages)</li>
                          <li>• Audio announcements in multiple languages</li>
                          <li>• Cultural sensitivity in design</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Elderly-Friendly Features</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Larger fonts and simplified interfaces</li>
                          <li>• Elderly mode toggle option</li>
                          <li>• Priority support for senior citizens</li>
                          <li>• Family member notification systems</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Response Protocol */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-red-50 to-pink-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Phone className="h-8 w-8 text-red-600 mr-4" />
                  Emergency Response and Crisis Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Government Emergency Integration</h4>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      SmartKumbh emergency features are integrated with official government emergency response systems, ensuring rapid coordination during crisis situations.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-red-800 mb-3">Direct Emergency Connections</h5>
                        <ul className="space-y-2 text-red-700">
                          <li>• Police Control Room (100)</li>
                          <li>• Medical Emergency Services (108)</li>
                          <li>• Fire and Rescue Services (101)</li>
                          <li>• Kumbh Mela Control Room (1950)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-orange-800 mb-3">Coordination Centers</h5>
                        <ul className="space-y-2 text-orange-700">
                          <li>• District Magistrate Office, Ujjain</li>
                          <li>• Superintendent of Police, Ujjain</li>
                          <li>• Chief Medical Officer, Ujjain</li>
                          <li>• NDRF Emergency Response Team</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Crisis Communication Protocol</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <div>
                          <h5 className="font-bold text-gray-800">Immediate Alert System</h5>
                          <p className="text-gray-600">Real-time push notifications for crowd emergencies, weather alerts, and security threats</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <div>
                          <h5 className="font-bold text-gray-800">Multi-Channel Broadcasting</h5>
                          <p className="text-gray-600">Coordination with official PA systems, local media, and emergency broadcasts</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <div>
                          <h5 className="font-bold text-gray-800">Family Notification</h5>
                          <p className="text-gray-600">Automated emergency contact notification system for registered family members</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security and Surveillance Compliance */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-gray-50 to-slate-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <MapPin className="h-8 w-8 text-gray-600 mr-4" />
                  Security and Surveillance Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Integration with Government Surveillance</h4>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      SmartKumbh location and crowd monitoring features are integrated with official government surveillance systems for enhanced security and crowd management.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Authorized Data Sharing</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Crowd density data for traffic management</li>
                          <li>• Emergency location data for rescue operations</li>
                          <li>• Lost person reports for law enforcement</li>
                          <li>• Security threat intelligence (anonymized)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Privacy Safeguards</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Data shared only during active emergencies</li>
                          <li>• Personal identifiers encrypted in transit</li>
                          <li>• Time-limited access for specific purposes</li>
                          <li>• Audit trails for all data access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Anti-Terrorism and Security Measures</h4>
                    <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
                      <h5 className="font-bold text-red-800 mb-3">National Security Compliance</h5>
                      <p className="text-red-700 leading-relaxed">
                        SmartKumbh operates under the oversight of National Security agencies and follows all protocols for large gathering security management as mandated by the Ministry of Home Affairs.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit and Compliance Monitoring */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <FileText className="h-8 w-8 text-indigo-600 mr-4" />
                  Audit and Compliance Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Regular Compliance Audits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Internal Audits</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Weekly security assessment</li>
                          <li>• Daily data protection compliance checks</li>
                          <li>• Continuous accessibility testing</li>
                          <li>• Real-time system monitoring</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">External Audits</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• STQC (GOI) annual security audit</li>
                          <li>• Independent accessibility assessment</li>
                          <li>• Third-party privacy compliance review</li>
                          <li>• Penetration testing by certified agencies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Transparency and Accountability</h4>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-2">Public Audit Reports</h5>
                        <p className="text-blue-700">Annual compliance reports published on government transparency portals for public review</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-2">Grievance Redressal</h5>
                        <p className="text-green-700">Dedicated channels for reporting compliance violations and seeking resolution</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Government Compliance Contacts</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  For questions about government guidelines, compliance issues, or regulatory concerns, contact the appropriate authorities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Compliance Officer</h4>
                    <p className="text-orange-600 mb-1">compliance@smartkumbh.gov.in</p>
                    <p className="text-gray-600 text-sm">+91 1800-COMPLY</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Data Protection Officer</h4>
                    <p className="text-orange-600 mb-1">dpo@smartkumbh.gov.in</p>
                    <p className="text-gray-600 text-sm">+91 1800-PRIVACY</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Accessibility Coordinator</h4>
                    <p className="text-orange-600 mb-1">accessibility@smartkumbh.gov.in</p>
                    <p className="text-gray-600 text-sm">+91 1800-ACCESS</p>
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