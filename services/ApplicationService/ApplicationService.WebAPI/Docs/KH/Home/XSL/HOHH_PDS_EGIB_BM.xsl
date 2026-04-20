<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>

			<head>
				<title></title>
				<style>
					ol {
					margin: 0;
					padding-left: 1.2em;
					}

					ul {
					margin: 0;
					padding-left: 1.2em;
					}

					ol.custom-indent {
					list-style-position: outside;
					/* numbers outside the content block */
					padding-left: 2.5em;
					/* space for numbers + extra indent */
					margin: 0;
					}

					ol.custom-indent li {
					text-indent: -1em;
					/* pull first line back */
					padding-left: 1em;
					/* indent the content */
					margin-bottom: 0.5em;
					/* optional spacing between items */
					}

					ol.custom-alpha {
					list-style: none;
					counter-reset: item;
					padding-left: 1.5em;
					}

					ol.custom-alpha li {
					counter-increment: item;
					position: relative;
					margin-bottom: 0px;
					}

					ol.custom-alpha li::before {
					content: counter(item, lower-alpha) ") ";
					position: absolute;
					left: -1.5em;
					}

					table {
					border-collapse: separate;
					page-break-inside: auto;
					page-break-after: auto;
					width: 100%;
					}

					tr {
					page-break-inside: avoid;
					page-break-after: auto;
					}
				</style>
			</head>

			<body>
				<table border="0" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
					<tr>
						<td style="height: 50px;
  vertical-align: bottom;">
							<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
								HELAIAN
								PENDEDAHAN PRODUK
							</strong>
							<br />
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								<strong>Pelanggan yang dihormati,</strong>
								<br />
								Helaian Pendedahan Produk (PDS) ini memberikan anda maklumat penting tentang pelan
								<strong>Insurans Pemilik Rumah/Isi Rumah</strong>. Pelanggan lain telah membaca PDS ini dan
								mendapati ia membantu, anda harus membacanya juga.
							</span>

						</td>
						<td>
							<img alt="Etiqa Logo" height='160' style="text-align: center;">
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_LogoImage" />
								</xsl:attribute>
							</img>
							<br />
						</td>

					</tr>
					<tr>
						<td>
						</td>
						<td style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: center;">
							<span>
								Tarikh: <xsl:value-of select="root/P_PaymentDate" />
							</span>
						</td>

					</tr>

				</table>


				<img alt="Number1Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number1Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					Apakah itu Insurans Pemilik Rumah/Isi Rumah?
				</strong>
				<br />
				<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
					lnsurans Pemilik Rumah/Isi Rumah memberikan perlindungan kepada bangunan (kediaman persendirian) anda
					dan kandungan isi rumah serta barangan peribadi di dalam rumah anda.
				</span>
				<br />
				<br />

				<img alt="Number2Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number2Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					Ketahui
					Perlindungan Anda
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td>
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
								Untuk tempoh perlindungan selama setahun, anda akan menerima perlindungan insurans seperti berikut:
							</span>
							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">No.</th>
									<th style="width: 65%">Jenis Manfaat</th>
									<th style="width: 15%">
										Pemilik Rumah<br/>
										(Bangunan)
									</th>
									<th style="width: 15%">
										Isi Rumah<br />
										(Kandungan)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">
										Kebakaran, kilat dan letupan yang disebabkan oleh gas yang
										digunakan untuk
										tujuan domestik
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Pesawat udara dan/atau peranti udara yang gugur
										daripadanya
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">Hentaman oleh sebarang kenderaan atau haiwan</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>4.</td>
									<td style="text-align: justify;">Pecahan atau limpahan tangki air domestik atau paip</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>5.</td>
									<td style="text-align: justify;">
										Kecurian dengan pemecahan menggunakan kekerasan dan
										keganasan ke dalam dan keluar
										dari rumah
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>6.</td>
									<td style="text-align: justify;">Ribut, puting beliung dan angin taufan</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>7.</td>
									<td style="text-align: justify;">Gempa bumi dan letusan gunung berapi</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>8.</td>
									<td style="text-align: justify;">Banjir</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>9.</td>
									<td style="text-align: justify;">Kerugian sewa (Had 10% daripada Jumlah Dilindungi)</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>10.</td>
									<td style="text-align: justify;">
										Liabiliti pihak ketiga untuk kemalangan di dalam rumah
										anda &#45; had limit sehingga
										RM50,000
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>11.</td>
									<td style="text-align: justify;">
										Harta yang dipindahkan sementara &#45; sehingga 15%
										daripada
										jumlah dilindungi
										pada kandungan rumah
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>12.</td>
									<td style="text-align: justify;">
										Kerosakan kepada cermin, selain dari cermin tangan &#45;
										sehingga RM500 setiap
										keping untuk setiap kemalangan
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>13.</td>
									<td style="text-align: justify;">
										Pampasan Kematian Orang yang Diinsuranskan, disebabkan
										oleh kebakaran atau rompakan
										di mana terdapat kemasukan ganas dan secara paksa ke rumah &#45; Had RM10,000 atau
										satu perdua daripada Keseluruhan Jumlah Dilindungi ke atas kandungan yang mana
										lebih rendah
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>14.</td>
									<td style="text-align: justify;">Harta orang gaji</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
							</table>
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
								Dengan membayar premium tambahan, anda boleh memperluaskan perlindungan di bawah:
							</span>

							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">No.</th>
									<th style="width: 65%">Jenis Manfaat</th>
									<th style="width: 15%">
										Pemilik Rumah<br />
										(Bangunan)
									</th>
									<th style="width: 15%">
										Isi Rumah<br />
										(Kandungan)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">Rusuhan, mogok dan kerosakan akibat keganasan</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Ditinggalkan tidak berpenghuni untuk lebih dari 90 hari
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">
										Kerosakan akibat kecurian tanpa pemecahan masuk dan/atau
										keluar rumah,
										menggunakan kekerasan dan keganasan sebenar tidak termasuk kecurian oleh orang gaji
										atau ahli keluarga
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
							</table>

							<br />
							<span>
								<strong>Nota: </strong>
							</span>
							<div style="text-align: justify">
								<ol>
									<li>Sila rujuk kontrak polisi untuk maklumat lanjut berkenaan manfaat-manfaat di atas.</li>
									<li>
										Tempoh perlindungan insurans adalah satu (1) tahun. Anda perlu memperbaharui kontrak
										polisi setiap tahun.
									</li>
									<li>
										Manfaat-manfaat yang dibayar di bawah produk yang layak adalah dilindungi oleh
										Perbadanan Insurans Deposit Malaysia (PIDM) sehingga had perlindungan. Sila rujuk Brosur
										Sistem Perlindungan Manfaat Takaful dan Insurans PIDM atau hubungi kami atau PIDM
										(layari
										www.pidm.gov.my).
									</li>
								</ol>
							</div>
							
							<br />

							<span>
								<strong>Kontrak polisi anda tidak melindungi kerugian tertentu seperti:</strong>
							</span>
							<ol>
								<li>
									Kehilangan atau kerosakan akibat penenggelaman, gelinciran tanah, rusuhan, mogok dan
									kerosakan akibat niat jahat;
								</li>
								<li>
									Kerugian atau kerosakan disebabkan oleh peperangan atau risiko seumpamanya;
								</li>
								<li>
									Kerugian atau kerosakan kepada bangunan jika dibiarkan lebih daripada sembilan puluh
									(90) hari (melainkan jika ia diberitahu secara bertulis kepada Kami dan dipersetujui
									oleh Kami melalui pengendorsan dikeluarkan);
								</li>
								<li>
									Kerugian atau kerosakan disebabkan oleh pencemaran radioaktif, radiasi nuklear atau
									risiko seumpamanya.
								</li>
							</ol>

							<p>
								<strong>Nota: </strong>Senarai ini tidak menyeluruh. Sila rujuk kontrak polisi untuk senarai
								penuh pengecualian.
							</p>
						</td>
					</tr>
				</table>
				<br/>

				<!--Page Break-->
				<div style="page-break-after: always"></div>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center; page-break-inside: avoid;">
					<tr>
						<td colspan="4" style="color: #000000; text-align: justify; vertical-align: top; border: none;">
							Sekiranya anda mempunyai sebarang soalan atau memerlukan bantuan mengenai produk insurans rumah,
							anda boleh:
						</td>
					</tr>
					<tr>
						<!-- Phone -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Phone" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_PhoneImage" />
								</xsl:attribute>
							</img>
							<br />
							Hubungi kami di 1-300-13-8888
							<br />
							(Etiqa Oneline)
						</td>

						<!-- Website -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Website" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_WebsiteImage" />
								</xsl:attribute>
							</img>
							<br />
							Layari
							<br />
							<xsl:value-of select="root/P_WebsiteUrl" />
						</td>

						<!-- Email -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Email" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_EmailImage" />
								</xsl:attribute>
							</img>
							<br />
							Emel kepada
							<br />
							info@etiqa.com.my
						</td>

						<!-- QR Code -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="QR Code" height='80'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_QRCodeImage" />
								</xsl:attribute>
							</img>
							<br />
							Imbas kod QR
						</td>
					</tr>
				</table>

				<br/>

				<img alt="Number3Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number3Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					Ketahui
					Kewajipan Anda
				</strong>
				<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; vertical-align: top;text-align: justify;font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td colspan=" 2">
							<strong>
								Untuk Insurans Pemilik Rumah/Isi Rumah, Jumlah premium tahunan yang perlu anda bayar adalah
								dikira berdasarkan jumlah perlindungan dan perlindungan tambahan, jika ada. Sebagai
								ilustrasi, untuk jumlah perlindungan RM <xsl:value-of select="root/P_CoverageAmount" />
								,
								anda harus membayar premium tahunan sebanyak:
							</strong>
						</td>
					</tr>
					<tr>
						<td>Premium Untuk Perlindungan Asas</td>
						<td>
							RM <xsl:value-of select="root/P_PlanPremium" />
						</td>
					</tr>
					<xsl:if test="root/P_HasAddOn = 'true'">
						<tr>
							<td>
								Perlindungan Tambahan<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:value-of select="position()" />
									.
									<xsl:value-of select="Name" />
									<br />
								</xsl:for-each>
							</td>
							<td>
								<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:text>RM </xsl:text>
									<xsl:value-of select="Premium" />
									<br />
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_HasAddOn = 'false'">
						<tr>
							<td>
								Perlindungan Tambahan<br />
								Tidak Berkenaan
							</td>
							<td>
								<br />
								RM 0.00
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_IsCommissionAgency = 'false' and root/P_IsCommissionBanca = 'false'">
						<tr>
							<td>(-) Diskaun kepada pelanggan</td>
							<td>
								<xsl:value-of select="root/P_DiscountRate" />
								% atau RM <xsl:value-of select="root/P_DiscountAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Jumlah premium
						</td>
						<td>
							RM <xsl:value-of select="root/P_NetPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<strong>Anda juga harus membayar fi and caj berikut:</strong>
						</td>
					</tr>
					<xsl:if test="root/P_IsCommissionAgency = 'true' or root/P_IsCommissionBanca = 'true'">
						<tr>
							<td>
								Komisen Dibayar Kepada Pengantara
							</td>
							<td>
								<xsl:value-of select="root/P_CommissionRate" />
								% atau RM
								<xsl:value-of select="root/P_CommisisonAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Cukai Perkhidmatan
						</td>
						<td>
							<xsl:value-of select="root/P_ServiceTaxRate" />
							% daripada jumlah premium atau RM
							<xsl:value-of select="root/P_ServiceTaxAmount" />
						</td>
					</tr>
					<tr>
						<td>Duti Setem</td>
						<td>
							RM <xsl:value-of select="root/P_StampDuty" />
						</td>
					</tr>
					<tr>
						<td>Jumlah Premium Perlu Dibayar</td>
						<td>
							RM <xsl:value-of select="root/P_TotalPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							Semua premium (jika terpakai) akan tertakluk kepada caj-caj atau cukai-cukai yang
							berkenaan, sebagaimana yang dianggap perlu oleh pihak berkuasa cukai Malaysia. Adalah
							penting untuk anda menyimpan apa-apa resit yang anda terima sebagai bukti pembayaran
							premium.
						</td>
					</tr>
				</table>
				<br />

				<img alt="Number4Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number4Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					Syarat Utama
					Lain
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
					<tr >
						<td >
							<div style="text-align: justify">
								<ol >
									<li >
										Anda harus memberikan maklumat tepat dan cukup semasa permohonan.
									</li>
									<li >
										Perlindungan insurans hanya berkuat kuasa apabila anda telah membayar premium (Bayaran
										Sebelum Perlindungan).
									</li>
									<li >
										Semua tuntutan hendaklah dimaklumkan kepada kami secepat mungkin tidak melebihi 30
										hari selepas kejadian yang melayakkan anda untuk membuat tuntutan ke atas polisi. Sila
										kemukakan kepada kami semua dokumen yang berkaitan untuk menyokong tuntutan anda.
										Sebarang dokumen atau bukti yang diperlukan oleh kami untuk mengesahkan tuntutan
										tersebut perlu dikemukakan kepada kami atas perbelanjaan anda sendiri.
									</li>
									<li >
										Nilai pasaran
										<ol type="i" >
											<li >
												Anda perlu memastikan harta anda dilindungi pada jumlah yang berpatutan
												sepanjang masa, dengan mengambil kira pengubahsuaian dan penambahbaikan yang
												dilakukan. Amaun yang dilindungi mesti melindungi kos membina semula rumah anda
												sekiranya berlaku kerugian / kerosakan.
											</li>
											<li >
												Untuk membantu anda dalam menentukan jumlah yang diinsuranskan, anda boleh
												menggunakan anggaran kalkulator kos bangunan yang disediakan oleh Persatuan
												Insurans Am Malaysia (PIAM) melalui pautan berikut:
												https://bcc.piam.org.my/. Sila
												ambil perhatian bahawa anda dinasihatkan untuk mendapatkan nasihat profesional
												bebas jika harta itu telah diubahsuai secara meluas dan / atau mempunyai reka
												bentuk yang unik / tidak standard.
											</li>
										</ol>
									</li>
									<li >
										Fasal Purata &#45; Sekiranya jumlah yang dilindungi dalam kontrak polisi anda adalah
										kurang daripada nilai sebenar pada waktu kerugian berlaku, anda adalah dianggap sebagai
										menanggung sendiri perbezaannya dan anda akan menanggung sebahagian daripada kerugian
										secara berkadar.
									</li>
									<li >
										Lebihan &#45; Hanya untuk sesetengah peril, seperti Pecahan atau limpahan tangki air
										domestik atau paip, Ribut, Puting Beliung, Angin Taufan, Gempa Bumi dan Letusan Gunung
										Berapi, dan Banjir.
									</li>
									<li >
										Perlindungan berkenaan Isi Rumah &#45; Jika mana-mana barangan rumah anda melebihi 5%
										daripada jumlah keseluruhan yang dilindungi; anda dinasihatkan untuk mengisytiharkan
										barang-barang ini secara berasingan.
									</li>
								</ol>
							</div>

							<p style="margin-top: 15px;">
								<strong>Nota: </strong>Senarai ini tidak menyeluruh. Sila rujuk kontrak polisi untuk senarai penuh terma dan syarat.
							</p>
						</td>
					</tr>
				</table>
				<br />

				<img alt="Red Question Mark" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_QuestionMarkImage" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					Bolehkah saya membatalkan polisi saya?
				</strong>
				<br />
				<div style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; text-align: justify;">
					Boleh. Anda boleh membatalkan polisi dengan memberi notis bertulis kepada kami. Selepas pembatalan, anda
					layak mendapat pemulangan sebahagian daripada premium dengan syarat anda tidak membuat sebarang tuntutan
					sepanjang tempoh insurans.
				</div>
			</body>

			<footer style="
  position: fixed;
  bottom: 0;
  right: 15px;
  color: gray;
  font-size: 12px;
  background: transparent;
  ">
				PMG/EGIB/HOHH/PDS/BM/2601V0.1
			</footer>

		</html>
	</xsl:template>
</xsl:stylesheet>