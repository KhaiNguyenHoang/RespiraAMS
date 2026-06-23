import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:respiraams/features/home/widgets/section.dart';
import 'package:respiraams/features/home/widgets/section_card.dart';
import 'package:respiraams/features/home/widgets/section_header.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<StatefulWidget> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("RespiraAMS")),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 25,
            children: [
              Section(
                header: SectionHeader(title: "Medical library"),
                cards: [
                  SectionCard(
                    text: "Antibiotic Spectra",
                    icon: Icon(FontAwesomeIcons.microscope.data),
                  ),
                  SectionCard(
                    text: "Antibiotics",
                    icon: Icon(FontAwesomeIcons.pills.data),
                  ),
                  SectionCard(
                    text: "Diseases",
                    icon: Icon(FontAwesomeIcons.disease.data),
                  ),
                  SectionCard(
                    text: "Pathogen",
                    icon: Icon(FontAwesomeIcons.virusCovid.data),
                  ),
                  SectionCard(
                    text: "Treatment protocols",
                    icon: Icon(FontAwesomeIcons.bookMedical.data),
                  ),
                ],
              ),
              Section(
                header: SectionHeader(title: "Diagnose and history"),
                cards: [
                  SectionCard(
                    text: "Diagnose",
                    icon: Icon(FontAwesomeIcons.personDotsFromLine.data),
                  ),
                  SectionCard(
                    text: "History",
                    icon: Icon(FontAwesomeIcons.clockRotateLeft.data),
                  ),
                  SectionCard(
                    text: "Analytics",
                    icon: Icon(FontAwesomeIcons.chartLine.data),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
