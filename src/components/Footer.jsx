import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const startYear = 2020
  const currentYear = new Date().getFullYear()
  return (
    <footer>
      <div className="bg-gray-600 py-4 text-white">
        <div className="container px-4 mx-auto">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="px-4 my-4 w-full xl:w-1/5">
              <a href="/" className="block w-56 mb-4">
                <Image
                  src="/logo/palmside-logo-transparent.png"
                  alt="PalmSide logo"
                  width={224}
                  height={40}
                  className="h-auto w-full"
                />
              </a>
              <p className="text-justify">
                Your trusted partner in finding the perfect property in Mallorca.
              </p>
            </div>

            <div className="px-4 my-4 w-full sm:w-auto">
              <div>
              <h2 className="relative inline-block text-2xl pb-4 mb-4 border-b-4 border-transparent after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-24 after:bg-gradient-to-r after:from-[#B08D57] after:via-[#C5A880] after:to-emerald-600">
  Company
</h2>
              </div>
              <ul className="leading-8">
                <li><a href="/site-notice" className="hover:text-[#B59A3D]">Site Notice</a></li>
                <li><a href="/terms" className="hover:text-[#B59A3D]">Terms &amp; Conditions</a></li>
                <li><a href="/privacy-policy" className="hover:text-[#B59A3D]">Privacy Policy</a></li>
                <li><a href="/about" className="hover:text-[#B59A3D]">About us</a></li>
              </ul>
            </div>

            <div className="px-4 my-4 w-full sm:w-auto">
              <div>
                <Link href="/contact" className="inline-block">
                  <h2 className="relative inline-block text-2xl pb-4 mb-4 border-b-4 border-transparent hover:text-[#B59A3D] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-24 after:bg-gradient-to-r after:from-[#B08D57] after:via-[#C5A880] after:to-emerald-600">
                    Contact
                  </h2>
                </Link>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Carrer%20de%20Ametler%203%20%E2%80%93%201B%2C%20ES-07609%20Llucmajor%2C%20Mallorca%20%E2%80%93%20Illes%20Balears"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#B59A3D] inline-flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 mt-1" />
                    <span>Carrer de Ametler 3 – 1B, ES-07609 Llucmajor, <br /> Mallorca – Illes Balears</span>
                  </a>
                </li>
                <li>
                  <div className="inline-flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+34 XXX XXX XXX?</span>
                  </div>
                </li>
                <li>
                  <a href="mailto:info@palmside.es" className="hover:text-[#B59A3D] inline-flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>info@palmside.es</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div className="px-4 my-4 w-full sm:w-auto xl:w-1/5">
              <div>
                <h2 className="inline-block text-2xl pb-4 mb-4 border-b-4 border-[#B59A3D]">Connect With Us</h2>
              </div>

              {/* Facebook */}
              <a
                href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fpalmside.es&h=AT0L6ugT3TGX2KEzBI_r1Q81ZQhJQBOqw9RNIRvcma46p6ThMezzYcCLUFIZBLjecL3ADuza_tDxo03_aHdJtjfNlRd9jUuYzQidaVRyhxGqVTB7olgT8ZO5N2G1oTCT&s=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-[#B59A3D] hover:border-[#B59A3D]"
              >
                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S293.9 0 268.08 0c-73.62 0-121.44 44.38-121.44 124.72v70.62H86.4V288h60.24v224h92.66V288z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/palmside.es?igsh=OTJtY2h4cGxnbnJn&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-[#B59A3D] hover:border-[#B59A3D]"
              >
                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 190.7c-41.9 0-75.9-34-75.9-75.9s34-75.9 75.9-75.9 75.9 34 75.9 75.9-34 75.9-75.9 75.9zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.7-9.9-67.3-36.2-93.5s-57.8-34.5-93.5-36.2C293.1 32 185 32 185 32s-108.1 0-147.9 1.6c-35.7 1.7-67.3 9.9-93.5 36.2S-3.1 127.4-4.8 163.1C-6.4 202.9-6.4 256-6.4 256s0 53.1 1.6 92.9c1.7 35.7 9.9 67.3 36.2 93.5s57.8 34.5 93.5 36.2C140.9 480 249 480 249 480s108.1 0 147.9-1.6c35.7-1.7 67.3-9.9 93.5-36.2s34.5-57.8 36.2-93.5c1.6-39.8 1.6-92.9 1.6-92.9s0-53.1-1.6-92.9z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@palmside.sl?_r=1&_d=el11761m703lk7&sec_uid=MS4wLjABAAAAdhnK0lR8wUh_sK4mR5sUtfzySYPKkPllxVIgSf8h4hpflAK2nAobCS4xwjkvtuxz&share_author_id=7509458378663609366&sharer_language=de&source=h5_m&u_code=ekf8iahi7gm7m2&item_author_type=1&utm_source=whatsapp&tt_from=whatsapp&enable_checksum=1&utm_medium=ios&share_link_id=241A4C61-2343-418A-AC41-0AC90B7C2822&user_id=7509458378663609366&sec_user_id=MS4wLjABAAAAdhnK0lR8wUh_sK4mR5sUtfzySYPKkPllxVIgSf8h4hpflAK2nAobCS4xwjkvtuxz&social_share_type=5&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-[#B59A3D] hover:border-[#B59A3D]"
              >
                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M448,209.9a210.1,210.1,0,0,1-122.77-39.25v178.4a162.69,162.69,0,1,1-141.49-161.21v81.84a81.19,81.19,0,1,0,57.06,77.51V0h84.43a124.1,124.1,0,0,0,122.77,124Z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/jeanette-bakacak-50b965376?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-[#B59A3D] hover:border-[#B59A3D]"
              >
                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 1 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.4V302.4c0-34.7-.7-79.2-48.2-79.2-48.2 0-55.6 37.7-55.6 76.7V448h-92.6V148.9h88.9v40.8h1.3c12.4-23.6 42.7-48.6 87.9-48.6 94 0 111.3 61.9 111.3 142.3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#B08D57] via-[#C5A880] to-emerald-600 py-4 text-gray-900">
        <div className="container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="px-4 w-full text-center sm:w-auto sm:text-left">
              Copyright © {startYear}
              {currentYear > startYear ? ` - ${currentYear}` : ''} Palmside S.L. All Rights Reserved.
            </div>
            <div className="px-4 w-full text-center sm:w-auto sm:text-left">
              Palmside S.L.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

