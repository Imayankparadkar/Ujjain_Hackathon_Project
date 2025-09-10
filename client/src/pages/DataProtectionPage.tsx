import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Lock, Shield, Database, FileText, AlertTriangle, Phone } from "lucide-react";

export default function DataProtectionPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Data Protection</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Comprehensive data protection measures ensuring pilgrim information security and privacy
          </p>
          <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4">
            <Lock className="h-6 w-6" />
            <span className="text-lg font-semibold">Military-Grade Security Standards</span>
          </div>
        </div>
      </section>

      {/* Data Protection Overview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multi-Layered Security Framework</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SmartKumbh employs enterprise-grade security measures to protect pilgrim data throughout the entire lifecycle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Lock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Encryption</h3>
              <p className="text-gray-600 text-base leading-relaxed">End-to-end encryption using AES-256 standards for all data transmission and storage</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Access Control</h3>
              <p className="text-gray-600 text-base leading-relaxed">Multi-factor authentication and role-based access controls protect sensitive information</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Database className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Governance</h3>
              <p className="text-gray-600 text-base leading-relaxed">Comprehensive policies governing data collection, processing, and retention practices</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Data Protection Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            
            {/* Data Collection and Processing */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-4" />
                  Data Collection and Processing Principles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Lawful Basis for Processing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Explicit Consent</h5>
                        <ul className="space-y-2 text-blue-700 text-sm">
                          <li>• Clear, informed consent for data collection</li>
                          <li>• Opt-in consent for marketing communications</li>
                          <li>• Granular consent for different data uses</li>
                          <li>• Easy withdrawal of consent mechanisms</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-3">Legitimate Interests</h5>
                        <ul className="space-y-2 text-green-700 text-sm">
                          <li>• Safety and emergency response services</li>
                          <li>• Crowd management and navigation</li>
                          <li>• Service improvement and optimization</li>
                          <li>• Fraud prevention and security</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Data Minimization</h4>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
                      <p className="text-yellow-700 leading-relaxed">
                        We collect only the minimum data necessary to provide our services effectively. Personal information is limited to what is directly relevant to pilgrim safety, navigation, and service delivery during the Kumbh Mela.
                      </p>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <h5 className="font-bold text-gray-800">Essential Data</h5>
                          <p className="text-gray-600 text-sm">Name, contact, emergency info</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <h5 className="font-bold text-gray-800">Service Data</h5>
                          <p className="text-gray-600 text-sm">Location, preferences, usage</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <h5 className="font-bold text-gray-800">Optional Data</h5>
                          <p className="text-gray-600 text-sm">Medical info, family contacts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Purpose Limitation</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Data is processed only for the specific purposes disclosed at collection</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>No secondary use of data without additional consent or legal basis</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Regular audits to ensure purpose limitation compliance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Security Measures */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Lock className="h-8 w-8 text-green-600 mr-4" />
                  Technical Security Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Encryption Standards</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Data in Transit</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• TLS 1.3 encryption for all communications</li>
                          <li>• HTTPS enforcement with HSTS headers</li>
                          <li>• Certificate pinning for mobile applications</li>
                          <li>• Perfect Forward Secrecy (PFS) implementation</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Data at Rest</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• AES-256 encryption for database storage</li>
                          <li>• Encrypted file systems for server storage</li>
                          <li>• Hardware Security Modules (HSM) for key management</li>
                          <li>• Regular key rotation policies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Infrastructure Security</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-3">Network Security</h5>
                        <ul className="space-y-2 text-green-700 text-sm">
                          <li>• Firewalls and intrusion detection</li>
                          <li>• DDoS protection and mitigation</li>
                          <li>• VPN access for administrators</li>
                          <li>• Network segmentation</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Server Security</h5>
                        <ul className="space-y-2 text-blue-700 text-sm">
                          <li>• Regular security patches</li>
                          <li>• Hardened operating systems</li>
                          <li>• Antivirus and anti-malware</li>
                          <li>• Server monitoring and logging</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-purple-800 mb-3">Application Security</h5>
                        <ul className="space-y-2 text-purple-700 text-sm">
                          <li>• Secure coding practices</li>
                          <li>• Regular vulnerability scanning</li>
                          <li>• Penetration testing</li>
                          <li>• Code review processes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Data Center Security</h4>
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-bold text-gray-800 mb-3">Physical Security</h5>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            <li>• 24/7 physical security and surveillance</li>
                            <li>• Biometric access controls</li>
                            <li>• Redundant power and cooling systems</li>
                            <li>• Fire suppression and environmental monitoring</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-bold text-gray-800 mb-3">Compliance</h5>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            <li>• MEITY-empaneled data centers in India</li>
                            <li>• ISO 27001 certified facilities</li>
                            <li>• SOC 2 Type II compliance</li>
                            <li>• Regular third-party audits</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access Controls and Authentication */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Shield className="h-8 w-8 text-purple-600 mr-4" />
                  Access Controls and Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Multi-Factor Authentication</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Administrative Access</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Hardware security keys (FIDO2/WebAuthn)</li>
                          <li>• Time-based one-time passwords (TOTP)</li>
                          <li>• SMS-based verification as backup</li>
                          <li>• Biometric authentication where available</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">User Authentication</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Optional two-factor authentication for users</li>
                          <li>• Social login integration (Google, Facebook)</li>
                          <li>• Password strength requirements</li>
                          <li>• Account lockout after failed attempts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Role-Based Access Control (RBAC)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-blue-800 mb-2">Public User</h5>
                        <p className="text-blue-700 text-sm">Basic navigation and safety features</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-green-800 mb-2">Registered User</h5>
                        <p className="text-green-700 text-sm">Full platform features and personalization</p>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-orange-800 mb-2">Staff/Volunteer</h5>
                        <p className="text-orange-700 text-sm">Limited admin functions and reporting</p>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-red-800 mb-2">Administrator</h5>
                        <p className="text-red-700 text-sm">Full system access and user management</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Principle of Least Privilege</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Users and systems are granted only the minimum access necessary for their function</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Regular access reviews and privilege recertification processes</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Automatic privilege expiration for temporary access grants</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Segregation of duties for sensitive operations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention and Deletion */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-amber-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Database className="h-8 w-8 text-orange-600 mr-4" />
                  Data Retention and Secure Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Retention Periods</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-orange-800 mb-3">Personal Data</h5>
                        <ul className="space-y-2 text-orange-700 text-sm">
                          <li>• Active period: During Kumbh Mela</li>
                          <li>• Retention: 1 year post-event</li>
                          <li>• Emergency data: 3 years (for legal requirements)</li>
                          <li>• Anonymous analytics: 5 years</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Location Data</h5>
                        <ul className="space-y-2 text-blue-700 text-sm">
                          <li>• Real-time: 24 hours only</li>
                          <li>• Aggregated: 6 months</li>
                          <li>• Emergency logs: 2 years</li>
                          <li>• Research data: Anonymized permanently</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-3">System Logs</h5>
                        <ul className="space-y-2 text-green-700 text-sm">
                          <li>• Access logs: 1 year</li>
                          <li>• Security logs: 7 years</li>
                          <li>• Audit trails: 10 years</li>
                          <li>• Backups: Automated deletion schedule</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Secure Deletion Procedures</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Digital Data Deletion</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Cryptographic erasure of encryption keys</li>
                          <li>• Multi-pass overwriting of storage media</li>
                          <li>• Deletion verification and certification</li>
                          <li>• Backup data purging processes</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Physical Media Destruction</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• NIST-compliant physical destruction</li>
                          <li>• Certificate of destruction provided</li>
                          <li>• Chain of custody documentation</li>
                          <li>• Environmental disposal compliance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Automated Retention Management</h4>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
                      <p className="text-yellow-700 leading-relaxed">
                        Our automated data lifecycle management system ensures data is securely deleted according to retention policies without manual intervention, reducing the risk of human error and ensuring consistent compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Breach Response */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-red-50 to-pink-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mr-4" />
                  Data Breach Response and Incident Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Incident Response Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-red-800 mb-2">Detection</h5>
                        <p className="text-red-700 text-sm">24/7 monitoring and automated alerts</p>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-orange-800 mb-2">Assessment</h5>
                        <p className="text-orange-700 text-sm">Rapid impact analysis and classification</p>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-yellow-800 mb-2">Containment</h5>
                        <p className="text-yellow-700 text-sm">Immediate isolation and threat mitigation</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-4 rounded-2xl text-center">
                        <h5 className="font-bold text-green-800 mb-2">Recovery</h5>
                        <p className="text-green-700 text-sm">System restoration and security enhancement</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Notification Procedures</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Regulatory Notification</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Data Protection Authority notification within 72 hours</li>
                          <li>• Law enforcement coordination if criminal activity suspected</li>
                          <li>• Government cybersecurity agencies (CERT-In) notification</li>
                          <li>• Compliance with sector-specific reporting requirements</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">User Notification</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Affected users notified within 72 hours via multiple channels</li>
                          <li>• Clear explanation of the incident and potential impact</li>
                          <li>• Specific actions users should take to protect themselves</li>
                          <li>• Regular updates throughout the resolution process</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Post-Incident Activities</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Forensic Analysis:</strong> Detailed investigation to understand attack vectors and scope</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Lessons Learned:</strong> Comprehensive review and improvement of security measures</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Security Enhancement:</strong> Implementation of additional controls to prevent recurrence</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Stakeholder Communication:</strong> Transparent reporting to all affected parties</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection Training and Awareness */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <FileText className="h-8 w-8 text-indigo-600 mr-4" />
                  Data Protection Training and Awareness
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Staff Training Programs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Mandatory Training</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Data protection fundamentals (annual)</li>
                          <li>• Security awareness training (quarterly)</li>
                          <li>• Incident response procedures (bi-annual)</li>
                          <li>• Role-specific privacy training</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Specialized Training</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Technical security training for IT staff</li>
                          <li>• Data Protection Officer certification</li>
                          <li>• Privacy by design workshops</li>
                          <li>• Vendor management and third-party risk</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">User Education</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-indigo-800 mb-3">Privacy Notices</h5>
                        <p className="text-indigo-700 text-sm">Clear, accessible information about data practices in multiple languages</p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Security Tips</h5>
                        <p className="text-blue-700 text-sm">Regular security awareness communications and best practice guidance</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-3">Rights Awareness</h5>
                        <p className="text-green-700 text-sm">Education about data subject rights and how to exercise them</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Continuous Improvement</h4>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-2xl">
                      <p className="text-blue-700 leading-relaxed">
                        We continuously evaluate and improve our data protection measures through regular risk assessments, privacy impact assessments, and feedback from users and stakeholders. Our privacy program evolves with changing regulations and emerging threats.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Data Protection Contact Information</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  For any questions about our data protection practices, to exercise your rights, or to report a security concern, please contact our Data Protection Officer.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <h4 className="font-bold text-gray-800">Data Protection Officer</h4>
                    </div>
                    <p className="text-orange-600 mb-1">dpo@smartkumbh.gov.in</p>
                    <p className="text-gray-600 text-sm">+91 1800-DPO-HELP</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-bold text-gray-800">Security Incidents</h4>
                    </div>
                    <p className="text-red-600 mb-1">security@smartkumbh.gov.in</p>
                    <p className="text-gray-600 text-sm">24/7 Emergency Hotline</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-bold text-gray-800">Data Requests</h4>
                    </div>
                    <p className="text-blue-600 mb-1">datarequests@smartkumbh.gov.in</p>
                    <p className="text-gray-600 text-sm">Subject Access Requests</p>
                  </div>
                </div>
                
                <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
                  <p className="text-yellow-800 font-semibold mb-2">Response Time Commitment</p>
                  <p className="text-yellow-700">We respond to all data protection inquiries within 48 hours and resolve requests within 30 days as required by law.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}