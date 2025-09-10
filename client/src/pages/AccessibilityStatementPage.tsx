import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Eye, Ear, Hand, Brain, Heart, Phone } from "lucide-react";

export default function AccessibilityStatementPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Accessibility Statement</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Ensuring equal access to SmartKumbh for all pilgrims, regardless of abilities
          </p>
          <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4">
            <Heart className="h-6 w-6" />
            <span className="text-lg font-semibold">Committed to Universal Access</span>
          </div>
        </div>
      </section>

      {/* Accessibility Overview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Accessibility Commitment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SmartKumbh is designed to be accessible to all pilgrims, including those with visual, auditory, motor, or cognitive disabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Eye className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Visual Accessibility</h3>
              <p className="text-gray-600 text-base leading-relaxed">Screen readers, high contrast, and magnification support</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Ear className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Hearing Accessibility</h3>
              <p className="text-gray-600 text-base leading-relaxed">Visual alerts, captions, and text alternatives</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Hand className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Motor Accessibility</h3>
              <p className="text-gray-600 text-base leading-relaxed">Keyboard navigation and alternative input methods</p>
            </Card>
            
            <Card className="p-10 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <Brain className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Cognitive Accessibility</h3>
              <p className="text-gray-600 text-base leading-relaxed">Simple language and clear navigation patterns</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Accessibility Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            
            {/* WCAG Compliance */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Eye className="h-8 w-8 text-blue-600 mr-4" />
                  WCAG 2.1 Level AA Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      SmartKumbh meets the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, ensuring that our digital platform is accessible to users with a wide range of disabilities.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-center">
                        <h4 className="font-bold text-blue-800 mb-3">Perceivable</h4>
                        <p className="text-blue-700 text-sm">Information is presented in ways users can perceive</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center">
                        <h4 className="font-bold text-green-800 mb-3">Operable</h4>
                        <p className="text-green-700 text-sm">Interface components are operable by all users</p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl text-center">
                        <h4 className="font-bold text-purple-800 mb-3">Understandable</h4>
                        <p className="text-purple-700 text-sm">Information and UI operation are understandable</p>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl text-center">
                        <h4 className="font-bold text-orange-800 mb-3">Robust</h4>
                        <p className="text-orange-700 text-sm">Content is robust enough for various assistive technologies</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Certification and Testing</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Third-party accessibility audit by certified WCAG evaluators</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Automated accessibility testing integrated into development process</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>User testing with people with disabilities</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span>Ongoing monitoring and improvement of accessibility features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visual Accessibility Features */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Eye className="h-8 w-8 text-green-600 mr-4" />
                  Visual Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Screen Reader Support</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Compatible Screen Readers</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• NVDA (Windows)</li>
                          <li>• JAWS (Windows)</li>
                          <li>• VoiceOver (iOS/macOS)</li>
                          <li>• TalkBack (Android)</li>
                          <li>• ORCA (Linux)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Screen Reader Features</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Semantic HTML structure</li>
                          <li>• ARIA labels and descriptions</li>
                          <li>• Logical reading order</li>
                          <li>• Skip navigation links</li>
                          <li>• Descriptive headings hierarchy</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Visual Enhancements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-gray-800 mb-3">High Contrast Mode</h5>
                        <p className="text-gray-600 text-sm">Enhanced color contrast ratios exceeding WCAG AA requirements (4.5:1 for normal text, 3:1 for large text)</p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-gray-800 mb-3">Font Scaling</h5>
                        <p className="text-gray-600 text-sm">Text can be enlarged up to 200% without horizontal scrolling or loss of functionality</p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-gray-800 mb-3">Color Independence</h5>
                        <p className="text-gray-600 text-sm">Information is not conveyed by color alone; icons and text provide additional context</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Alternative Text and Descriptions</h4>
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-2xl">
                      <p className="text-green-700 leading-relaxed">
                        All images, icons, and visual elements include comprehensive alternative text descriptions. Complex images like maps and charts include detailed long descriptions to convey essential information to screen reader users.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motor and Input Accessibility */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Hand className="h-8 w-8 text-purple-600 mr-4" />
                  Motor and Input Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Keyboard Navigation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Full Keyboard Support</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Tab and Shift+Tab for navigation</li>
                          <li>• Enter and Space for activation</li>
                          <li>• Arrow keys for menu navigation</li>
                          <li>• Escape key to close dialogs</li>
                          <li>• Home/End keys for lists</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Focus Management</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Visible focus indicators</li>
                          <li>• Logical tab order</li>
                          <li>• Focus trapping in modals</li>
                          <li>• Skip to main content links</li>
                          <li>• Focus restoration after interactions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Touch and Gesture Accessibility</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-purple-800 mb-3">Large Touch Targets</h5>
                        <p className="text-purple-700 text-sm">All interactive elements are at least 44x44 pixels to accommodate users with motor difficulties</p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Gesture Alternatives</h5>
                        <p className="text-blue-700 text-sm">All gesture-based interactions have alternative methods (buttons, links, or keyboard shortcuts)</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-green-800 mb-3">No Time Limits</h5>
                        <p className="text-green-700 text-sm">Users can take as much time as needed for interactions, with warnings for sessions that may timeout</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Assistive Technology Support</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Voice Control:</strong> Compatible with voice recognition software and voice navigation</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Switch Navigation:</strong> Support for single-switch and multi-switch navigation devices</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Eye Tracking:</strong> Compatible with eye-tracking devices for users with severe motor limitations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cognitive Accessibility */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-amber-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Brain className="h-8 w-8 text-orange-600 mr-4" />
                  Cognitive and Learning Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Content Clarity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Language and Writing</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Plain language principles</li>
                          <li>• Short, clear sentences</li>
                          <li>• Common vocabulary</li>
                          <li>• Consistent terminology</li>
                          <li>• Explanations for complex terms</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Information Architecture</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Logical page structure</li>
                          <li>• Clear headings hierarchy</li>
                          <li>• Breadcrumb navigation</li>
                          <li>• Consistent layout patterns</li>
                          <li>• Predictable navigation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Error Prevention and Support</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-orange-800 mb-3">Error Prevention</h5>
                        <p className="text-orange-700 text-sm">Form validation and helpful instructions prevent errors before they occur</p>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-red-800 mb-3">Clear Error Messages</h5>
                        <p className="text-red-700 text-sm">Error messages explain what went wrong and how to fix it in simple terms</p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                        <h5 className="font-bold text-blue-800 mb-3">Help and Support</h5>
                        <p className="text-blue-700 text-sm">Context-sensitive help and multiple ways to get assistance</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Memory and Attention Support</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Progress Indicators:</strong> Clear indication of where users are in multi-step processes</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Save and Resume:</strong> Ability to save progress and resume tasks later</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Confirmation Dialogs:</strong> Important actions require confirmation to prevent accidental changes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hearing Accessibility */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Ear className="h-8 w-8 text-green-600 mr-4" />
                  Hearing and Audio Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Audio Content Alternatives</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Captions and Transcripts</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Live streaming events with real-time captions</li>
                          <li>• Audio announcements with text alternatives</li>
                          <li>• Video content with synchronized captions</li>
                          <li>• Full transcripts for audio content</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Visual Indicators</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Visual alerts for audio notifications</li>
                          <li>• Flash or color changes for important alerts</li>
                          <li>• Text descriptions of audio events</li>
                          <li>• Visual feedback for user interactions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Sign Language Support</h4>
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-2xl">
                      <p className="text-green-700 leading-relaxed">
                        For critical safety information and emergency procedures, we provide Indian Sign Language (ISL) interpretation through video content and have trained staff available for in-person assistance at information centers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Elderly and Age-Related Accessibility */}
            <Card className="mb-12 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-100 p-10">
                <CardTitle className="text-3xl text-gray-800 flex items-center">
                  <Heart className="h-8 w-8 text-indigo-600 mr-4" />
                  Elderly and Age-Related Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Elderly Mode Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Enhanced Visibility</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Larger font sizes (up to 150% increase)</li>
                          <li>• Higher contrast color schemes</li>
                          <li>• Simplified interface with fewer elements</li>
                          <li>• Larger buttons and touch targets</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Simplified Navigation</h5>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Reduced cognitive load with cleaner layouts</li>
                          <li>• Priority features prominently displayed</li>
                          <li>• Step-by-step guidance for complex tasks</li>
                          <li>• Emergency features easily accessible</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Family Support Features</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Family Notifications:</strong> Automatic alerts to family members about pilgrim's safety status</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Remote Assistance:</strong> Family members can view location and safety status (with permission)</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span><strong>Emergency Contacts:</strong> Quick access to family, medical, and emergency services</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Support and Feedback */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6">Accessibility Support and Feedback</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    We are committed to continuously improving accessibility. If you encounter any barriers or have suggestions for improvement, please contact our accessibility team.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Get Accessibility Help</h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-semibold text-gray-800">Accessibility Hotline</p>
                            <p className="text-orange-600">+91 1800-ACCESS-HELP</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center space-x-3">
                          <Heart className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-semibold text-gray-800">Email Support</p>
                            <p className="text-orange-600">accessibility@smartkumbh.gov.in</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center space-x-3">
                          <Eye className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-semibold text-gray-800">In-Person Support</p>
                            <p className="text-gray-600">Available at all Information Centers</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Report Accessibility Issues</h4>
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                      <p className="text-blue-700 leading-relaxed mb-4">
                        Help us improve by reporting accessibility barriers you encounter. We aim to respond to all accessibility feedback within 48 hours.
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="text-blue-800 font-semibold">Include in your report:</p>
                        <ul className="text-blue-700 ml-4">
                          <li>• Description of the barrier</li>
                          <li>• Device and browser information</li>
                          <li>• Assistive technology used</li>
                          <li>• Your suggestions for improvement</li>
                        </ul>
                      </div>
                    </div>
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