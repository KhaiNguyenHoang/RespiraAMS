import 'package:flutter/material.dart';
import 'package:respiraams/features/home/widgets/section_card.dart';
import 'package:respiraams/features/home/widgets/section_header.dart';

class Section extends StatelessWidget {
  final SectionHeader header;
  final List<SectionCard> cards;

  const Section({super.key, required this.header, required this.cards});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        header,
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.0,
            children: cards,
          ),
        ),
      ],
    );
  }
}