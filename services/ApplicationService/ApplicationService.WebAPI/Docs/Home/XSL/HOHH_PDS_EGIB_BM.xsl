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
					padding-left: 2.5em;
					margin: 0;
					}

					ol.custom-indent li {
					text-indent: -1em;
					padding-left: 1em;
					margin-bottom: 0.5em;
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
						<td style="height: 50px; vertical-align: bottom;">
							<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
								LEMBAR INFORMASI PRODUK
							</strong>
							<br />
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								<strong>Nasabah yang terhormat,</strong>
								<br />
								Lembar Informasi Produk (LIP) ini memberikan Anda informasi penting tentang paket
								<strong>Asuransi Pemilik Rumah/Isi Rumah</strong>. Nasabah lain telah membaca LIP ini dan
								menemukan manfaatnya, Anda juga sebaiknya membacanya.
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
								Tanggal: <xsl:value-of select="root/P_PaymentDate" />
							</span>
						</td>
					</tr>
				</table>

				<img alt="Number1Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number1Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					Apa itu Asuransi Pemilik Rumah/Isi Rumah?
				</strong>
				<br />
				<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
					Asuransi Pemilik Rumah/Isi Rumah memberikan perlindungan kepada bangunan (tempat tinggal pribadi) Anda
					dan isi rumah serta barang-barang pribadi di dalam rumah Anda.
				</span>
				<br />
				<br />

				<img alt="Number2Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number2Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					Ketahui Perlindungan Anda
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td>
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								Untuk periode perlindungan selama satu tahun, Anda akan mendapatkan perlindungan asuransi sebagai berikut:
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
										(Konten)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">
										Kebakaran, petir dan ledakan yang disebabkan oleh gas yang
										digunakan untuk keperluan rumah tangga
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Pesawat udara dan/atau benda yang jatuh darinya
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">Benturan oleh kendaraan atau hewan</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>4.</td>
									<td style="text-align: justify;">Pecah atau meluapnya tangki air atau pipa domestik</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>5.</td>
									<td style="text-align: justify;">
										Pencurian dengan pemaksaan dan kekerasan masuk ke dalam dan
										keluar dari rumah
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>6.</td>
									<td style="text-align: justify;">Badai, puting beliung dan angin topan</td>
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
									<td style="text-align: justify;">Kerugian sewa (Maksimum 10% dari Jumlah Pertanggungan)</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>10.</td>
									<td style="text-align: justify;">
										Tanggung jawab pihak ketiga atas kecelakaan di dalam rumah
										Anda &#45; batas hingga
										IDR 500.000.000
									</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>11.</td>
									<td style="text-align: justify;">
										Harta yang dipindahkan sementara &#45; hingga 15%
										dari jumlah pertanggungan isi rumah
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>12.</td>
									<td style="text-align: justify;">
										Kerusakan pada cermin, selain cermin tangan &#45;
										hingga IDR 5.000.000 per lembar per kejadian
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>13.</td>
									<td style="text-align: justify;">
										Kompensasi Kematian Tertanggung akibat kebakaran atau perampokan
										dengan kekerasan dan pemaksaan masuk ke rumah &#45; Maksimum IDR 100.000.000 atau
										setengah dari Total Jumlah Pertanggungan atas isi rumah mana yang lebih rendah
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>14.</td>
									<td style="text-align: justify;">Harta milik pembantu rumah tangga</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
							</table>
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								Dengan membayar premi tambahan, Anda dapat memperluas perlindungan di bawah ini:
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
										(Konten)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">Kerusuhan, mogok dan kerusakan akibat kejahatan</td>
									<td class="covered">Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Ditinggalkan tanpa penghuni lebih dari 90 hari
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">
										Kerusakan akibat pencurian tanpa pemaksaan masuk dan/atau
										keluar rumah menggunakan kekerasan nyata, tidak termasuk pencurian oleh pembantu
										atau anggota keluarga
									</td>
									<td class="not-covered">Tidak Dilindungi</td>
									<td class="covered">Dilindungi</td>
								</tr>
							</table>

							<br />
							<span>
								<strong>Catatan: </strong>
							</span>
							<div style="text-align: justify">
								<ol>
									<li>Silakan merujuk kontrak polis untuk informasi lebih lanjut mengenai manfaat-manfaat di atas.</li>
									<li>
										Periode perlindungan asuransi adalah satu (1) tahun. Anda perlu memperbarui kontrak
										polis setiap tahun.
									</li>
									<li>
										Manfaat-manfaat yang dibayarkan di bawah produk yang memenuhi syarat dilindungi oleh
										Otoritas Jasa Keuangan (OJK) sesuai ketentuan yang berlaku. Silakan merujuk brosur
										Sistem Perlindungan Manfaat Asuransi atau hubungi kami atau OJK
										(kunjungi www.ojk.go.id).
									</li>
								</ol>
							</div>

							<br />

							<span>
								<strong>Kontrak polis Anda tidak melindungi kerugian tertentu seperti:</strong>
							</span>
							<ol>
								<li>
									Kehilangan atau kerusakan akibat tenggelam, tanah longsor, kerusuhan, mogok dan
									kerusakan akibat niat jahat;
								</li>
								<li>
									Kerugian atau kerusakan yang disebabkan oleh perang atau risiko sejenisnya;
								</li>
								<li>
									Kerugian atau kerusakan pada bangunan jika dibiarkan lebih dari sembilan puluh
									(90) hari (kecuali telah diberitahukan secara tertulis kepada Kami dan disetujui
									oleh Kami melalui endorsemen yang diterbitkan);
								</li>
								<li>
									Kerugian atau kerusakan yang disebabkan oleh kontaminasi radioaktif, radiasi nuklir
									atau risiko sejenisnya.
								</li>
							</ol>

							<p>
								<strong>Catatan: </strong>Daftar ini tidak lengkap. Silakan merujuk kontrak polis untuk daftar
								lengkap pengecualian.
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
							Apabila Anda memiliki pertanyaan atau memerlukan bantuan mengenai produk asuransi rumah,
							Anda dapat:
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
							Hubungi kami di 1500 888
							<br />
							(Etiqa Online)
						</td>

						<!-- Website -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Website" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_WebsiteImage" />
								</xsl:attribute>
							</img>
							<br />
							Kunjungi
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
							Kirim email ke
							<br />
							info@etiqa.co.id
						</td>

						<!-- QR Code -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="QR Code" height='80'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_QRCodeImage" />
								</xsl:attribute>
							</img>
							<br />
							Pindai kode QR
						</td>
					</tr>
				</table>

				<br/>

				<img alt="Number3Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number3Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					Ketahui Kewajiban Anda
				</strong>
				<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; vertical-align: top; text-align: justify; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td colspan="2">
							<strong>
								Untuk Asuransi Pemilik Rumah/Isi Rumah, jumlah premi tahunan yang harus Anda bayar
								dihitung berdasarkan jumlah pertanggungan dan perlindungan tambahan, jika ada. Sebagai
								ilustrasi, untuk jumlah pertanggungan IDR <xsl:value-of select="root/P_CoverageAmount" />
								,
								Anda harus membayar premi tahunan sebesar:
							</strong>
						</td>
					</tr>
					<tr>
						<td>Premi Untuk Perlindungan Dasar</td>
						<td>
							IDR <xsl:value-of select="root/P_PlanPremium" />
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
									<xsl:text>IDR </xsl:text>
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
								Tidak Berlaku
							</td>
							<td>
								<br />
								IDR 0.00
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_IsCommissionAgency = 'false' and root/P_IsCommissionBanca = 'false'">
						<tr>
							<td>(-) Diskon kepada nasabah</td>
							<td>
								<xsl:value-of select="root/P_DiscountRate" />
								% atau IDR <xsl:value-of select="root/P_DiscountAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Jumlah premi
						</td>
						<td>
							IDR <xsl:value-of select="root/P_NetPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<strong>Anda juga harus membayar biaya dan tarif berikut:</strong>
						</td>
					</tr>
					<xsl:if test="root/P_IsCommissionAgency = 'true' or root/P_IsCommissionBanca = 'true'">
						<tr>
							<td>
								Komisi Dibayar Kepada Perantara
							</td>
							<td>
								<xsl:value-of select="root/P_CommissionRate" />
								% atau IDR
								<xsl:value-of select="root/P_CommisisonAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Pajak Layanan
						</td>
						<td>
							<xsl:value-of select="root/P_ServiceTaxRate" />
							% dari jumlah premi atau IDR
							<xsl:value-of select="root/P_ServiceTaxAmount" />
						</td>
					</tr>
					<tr>
						<td>Bea Materai</td>
						<td>
							IDR <xsl:value-of select="root/P_StampDuty" />
						</td>
					</tr>
					<tr>
						<td>Jumlah Premi yang Harus Dibayar</td>
						<td>
							IDR <xsl:value-of select="root/P_TotalPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							Semua premi (jika berlaku) akan tunduk pada biaya atau pajak yang relevan sebagaimana
							ditetapkan oleh otoritas perpajakan Indonesia. Penting bagi Anda untuk menyimpan
							setiap kwitansi yang Anda terima sebagai bukti pembayaran premi.
						</td>
					</tr>
				</table>
				<br />

				<img alt="Number4Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number4Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					Ketentuan Utama Lainnya
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
					<tr>
						<td>
							<div style="text-align: justify">
								<ol>
									<li>
										Anda harus memberikan informasi yang akurat dan lengkap pada saat pengajuan.
									</li>
									<li>
										Perlindungan asuransi hanya berlaku setelah Anda membayar premi (Pembayaran
										Sebelum Perlindungan).
									</li>
									<li>
										Semua klaim harus diberitahukan kepada kami sesegera mungkin tidak lebih dari 30
										hari setelah kejadian yang memberi Anda hak untuk mengajukan klaim atas polis. Silakan
										kirimkan kepada kami semua dokumen yang relevan untuk mendukung klaim Anda.
										Dokumen atau bukti apa pun yang kami perlukan untuk memverifikasi klaim tersebut
										harus dikirimkan kepada kami atas biaya Anda sendiri.
									</li>
									<li>
										Nilai Pasar
										<ol type="i">
											<li>
												Anda perlu memastikan properti Anda diasuransikan pada jumlah yang memadai
												setiap saat, dengan mempertimbangkan renovasi dan perbaikan yang dilakukan.
												Jumlah pertanggungan harus mencakup biaya membangun kembali rumah Anda
												jika terjadi kerugian/kerusakan.
											</li>
											<li>
												Untuk membantu Anda menentukan jumlah pertanggungan, Anda dapat
												menggunakan kalkulator estimasi biaya bangunan yang disediakan oleh
												Asosiasi Asuransi Umum Indonesia (AAUI) melalui tautan berikut:
												https://www.aaui.or.id/. Harap diperhatikan bahwa Anda disarankan untuk
												mendapatkan saran profesional independen jika properti telah direnovasi
												secara ekstensif dan/atau memiliki desain unik/non-standar.
											</li>
										</ol>
									</li>
									<li>
										Klausul Proporsional &#45; Jika jumlah pertanggungan dalam kontrak polis Anda lebih
										rendah dari nilai sebenarnya pada saat kerugian terjadi, Anda dianggap menanggung
										sendiri selisihnya dan Anda akan menanggung sebagian dari kerugian secara proporsional.
									</li>
									<li>
										Risiko Sendiri &#45; Hanya untuk risiko tertentu, seperti Pecah atau meluapnya tangki
										air atau pipa domestik, Badai, Puting Beliung, Angin Topan, Gempa Bumi dan Letusan
										Gunung Berapi, dan Banjir.
									</li>
									<li>
										Perlindungan Isi Rumah &#45; Jika salah satu barang rumah Anda melebihi 5%
										dari total jumlah pertanggungan; Anda disarankan untuk mendeklarasikan
										barang-barang tersebut secara terpisah.
									</li>
								</ol>
							</div>

							<p style="margin-top: 15px;">
								<strong>Catatan: </strong>Daftar ini tidak lengkap. Silakan merujuk kontrak polis untuk daftar lengkap syarat dan ketentuan.
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
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					Dapatkah saya membatalkan polis saya?
				</strong>
				<br />
				<div style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: justify;">
					Bisa. Anda dapat membatalkan polis dengan memberikan pemberitahuan tertulis kepada kami. Setelah pembatalan,
					Anda berhak mendapatkan pengembalian sebagian premi dengan syarat Anda tidak mengajukan klaim apa pun
					selama periode asuransi.
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
				PMG/EGIB/HOHH/LIP/BI/2601V0.1
			</footer>

		</html>
	</xsl:template>
</xsl:stylesheet>
