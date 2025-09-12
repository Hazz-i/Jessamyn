const AppFooter = () => {
    return (
        <footer className="bg-[#AFC29E] text-gray-800">
            <div className="container mx-auto px-4 py-10 md:px-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Logo & Address */}
                    <div>
                        <img src="/jessamynLogo.png" alt="Jessamyn" className="mb-2 h-16" />
                        <p className="text-xs leading-tight font-medium">
                            Tunjungan RT.03/RW.02, Gatak 2, Selomartani,
                            <br />
                            Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa
                            <br />
                            Yogyakarta 55571
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        {/* Company */}
                        <div>
                            <h4 className="mb-2 font-semibold text-primary-foreground">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>Home</li>
                                <li>About Us</li>
                                <li>Products</li>
                                <li>Contacts</li>
                            </ul>
                        </div>
                        {/* Products */}
                        <div>
                            <h4 className="mb-2 font-semibold text-primary-foreground">Products</h4>
                            <ul className="space-y-2 text-sm">
                                <li>Produk Herbal Premium</li>
                                <li>Relaksasi & Aromaterapi</li>
                                <li>Konsultasi Kesehatan Alami</li>
                            </ul>
                        </div>
                        {/* Get In Touch */}
                        <div>
                            <h4 className="mb-2 font-semibold text-primary-foreground">Get In Touch</h4>
                            <p className="mb-2 text-sm">jessamyncompany@gmail.com</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary-foreground text-primary">
                                    <i className="bx bxl-tiktok text-xl" />
                                </span>
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary-foreground text-primary">
                                    <i className="bx bxl-shopify text-xl" />
                                </span>
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary-foreground text-primary">
                                    <i className="bx bxl-instagram text-xl" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-6 h-px bg-primary-foreground" />

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2 text-sm text-primary-foreground">
                        <span className="mr-1">&#169;</span>
                        2025 Jessamyn, All rights reserved.
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-primary-foreground sm:flex-row sm:gap-6">
                        <span>Terms & Conditions</span>
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
