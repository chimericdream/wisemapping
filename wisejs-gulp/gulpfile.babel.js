'use strict';

import gulp from 'gulp';

import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';

gulp.task('clean', () => {
    return del(['dist/**/*']);
});

gulp.task('web2d-concat', ['clean'], () => {
    let dir = './src/web2d';
    return gulp.src([
        `${dir}/header.js`,
        `${dir}/peer/utils/EventUtils.js`,
        `${dir}/peer/utils/TransformUtils.js`,
        `${dir}/peer/svg/ElementPeer.js`,
        `${dir}/peer/svg/ElipsePeer.js`,
        `${dir}/peer/svg/Font.js`,
        `${dir}/peer/svg/ArialFont.js`,
        `${dir}/peer/svg/PolyLinePeer.js`,
        `${dir}/peer/svg/CurvedLinePeer.js`,
        `${dir}/peer/svg/ArrowPeer.js`,
        `${dir}/peer/svg/TextPeer.js`,
        `${dir}/peer/svg/WorkspacePeer.js`,
        `${dir}/peer/svg/GroupPeer.js`,
        `${dir}/peer/svg/RectPeer.js`,
        `${dir}/peer/svg/ImagePeer.js`,
        `${dir}/peer/svg/TimesFont.js`,
        `${dir}/peer/svg/LinePeer.js`,
        `${dir}/peer/svg/TahomaFont.js`,
        `${dir}/peer/svg/VerdanaFont.js`,
        `${dir}/Element.js`,
        `${dir}/Elipse.js`,
        `${dir}/Font.js`,
        `${dir}/Group.js`,
        `${dir}/Image.js`,
        `${dir}/Line.js`,
        `${dir}/PolyLine.js`,
        `${dir}/CurvedLine.js`,
        `${dir}/Arrow.js`,
        `${dir}/Rect.js`,
        `${dir}/Text.js`,
        `${dir}/Toolkit.js`,
        `${dir}/Workspace.js`,
        `${dir}/Point.js`
    ])
        .pipe(concat('web2d.min.js'))
        .pipe(gulp.dest('./dist/js'))
});
gulp.task('web2d', ['web2d-concat']);

gulp.task('core-js-concat', ['clean'], () => {
    let dir = './src/core-js';
    return gulp.src([
        `${dir}/header.js`,
        `${dir}/Functions.js`,
        `${dir}/Utils.js`
    ])
        .pipe(concat('core-js.min.js'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('core-js', ['core-js-concat']);

gulp.task('mindplot-concat', ['clean', 'web2d-concat'], () => {
    let dir = './src/mindplot';
    return gulp.src([
        `${dir}/header.js`,
        `${dir}/Events.js`,
        `${dir}/Options.js`,
        `./dist/web2d.min.js`,
        `${dir}/Messages.js`,
        `${dir}/TopicEventDispatcher.js`,
        `${dir}/model/IMindmap.js`,
        `${dir}/model/Mindmap.js`,
        `${dir}/model/INodeModel.js`,
        `${dir}/model/NodeModel.js`,
        `${dir}/model/RelationshipModel.js`,
        `${dir}/ActionDispatcher.js`,
        `${dir}/StandaloneActionDispatcher.js`,
        `${dir}/DesignerModel.js`,
        `${dir}/Designer.js`,
        `${dir}/ScreenManager.js`,
        `${dir}/Workspace.js`,
        `${dir}/ShrinkConnector.js`,
        `${dir}/Keyboard.js`,
        `${dir}/DesignerKeyboard.js`,
        `${dir}/Keyboard.js`,
        `${dir}/TopicStyle.js`,
        `${dir}/NodeGraph.js`,
        `${dir}/Topic.js`,
        `${dir}/CentralTopic.js`,
        `${dir}/MainTopic.js`,
        `${dir}/DragTopic.js`,
        `${dir}/DragManager.js`,
        `${dir}/DragPivot.js`,
        `${dir}/ConnectionLine.js`,
        `${dir}/Relationship.js`,
        `${dir}/DragConnector.js`,
        `${dir}/TextEditor.js`,
        `${dir}/MultilineTextEditor.js`,
        `${dir}/TextEditorFactory.js`,
        `${dir}/util/Shape.js`,
        `${dir}/util/FadeEffect.js`,
        `${dir}/persistence/ModelCodeName.js`,
        `${dir}/persistence/XMLSerializer_Pela.js`,
        `${dir}/persistence/XMLSerializer_Tango.js`,
        `${dir}/persistence/Pela2TangoMigrator.js`,
        `${dir}/persistence/XMLSerializer_Beta.js`,
        `${dir}/persistence/Beta2PelaMigrator.js`,
        `${dir}/persistence/XMLSerializerFactory.js`,
        `${dir}/PersistenceManager.js`,
        `${dir}/RestPersistenceManager.js`,
        `${dir}/LocalStorageManager.js`,
        `${dir}/EditorProperties.js`,
        `${dir}/IconGroup.js`,
        `${dir}/Icon.js`,
        `${dir}/LinkIcon.js`,
        `${dir}/NoteIcon.js`,
        `${dir}/ActionIcon.js`,
        `${dir}/ImageIcon.js`,
        `${dir}/model/FeatureModel.js`,
        `${dir}/model/IconModel.js`,
        `${dir}/model/LinkModel.js`,
        `${dir}/model/NoteModel.js`,
        `${dir}/Command.js`,
        `${dir}/DesignerActionRunner.js`,
        `${dir}/DesignerUndoManager.js`,
        `${dir}/ControlPoint.js`,
        `${dir}/EditorOptions.js`,
        `${dir}/RelationshipPivot.js`,
        `${dir}/TopicFeature.js`,
        `${dir}/commands/GenericFunctionCommand.js`,
        `${dir}/commands/DeleteCommand.js`,
        `${dir}/commands/DragTopicCommand.js`,
        `${dir}/commands/AddTopicCommand.js`,
        `${dir}/commands/ChangeFeatureToTopicCommand.js`,
        `${dir}/commands/RemoveFeatureFromTopicCommand.js`,
        `${dir}/commands/AddFeatureToTopicCommand.js`,
        `${dir}/commands/AddRelationshipCommand.js`,
        `${dir}/commands/MoveControlPointCommand.js`,
        `${dir}/widget/ModalDialogNotifier.js`,
        `${dir}/widget/ToolbarNotifier.js`,
        `${dir}/widget/ToolbarItem.js`,
        `${dir}/widget/ToolbarPaneItem.js`,
        `${dir}/widget/NoteEditor.js`,
        `${dir}/widget/LinkEditor.js`,
        `${dir}/widget/FloatingTip.js`,
        `${dir}/widget/LinkIconTooltip.js`,
        `${dir}/widget/KeyboardShortcutTooltip.js`,
        `${dir}/widget/ColorPalettePanel.js`,
        `${dir}/widget/ListToolbarPanel.js`,
        `${dir}/widget/FontFamilyPanel.js`,
        `${dir}/widget/FontSizePanel.js`,
        `${dir}/widget/TopicShapePanel.js`,
        `${dir}/widget/IconPanel.js`,
        `${dir}/widget/IMenu.js`,
        `${dir}/widget/Menu.js`,
        `${dir}/TopicFeature.js`,
        `${dir}/layout/EventBusDispatcher.js`,
        `${dir}/layout/ChangeEvent.js`,
        `${dir}/layout/LayoutManager.js`,
        `${dir}/layout/Node.js`,
        `${dir}/layout/RootedTreeSet.js`,
        `${dir}/layout/ChildrenSorterStrategy.js`,
        `${dir}/layout/AbstractBasicSorter.js`,
        `${dir}/layout/BalancedSorter.js`,
        `${dir}/layout/SymmetricSorter.js`,
        `${dir}/layout/GridSorter.js`,
        `${dir}/layout/OriginalLayout.js`,
        `${dir}/layout/EventBus.js`,
        `${dir}/MessageBundle_en.js`,
        `${dir}/MessageBundle_es.js`,
        `${dir}/MessageBundle_de.js`,
        `${dir}/MessageBundle_fr.js`,
        `${dir}/MessageBundle_pt_BR.js`,
        `${dir}/MessageBundle_zh_CN.js`,
        `${dir}/MessageBundle_zh_TW.js`,
        `${dir}/MessageBundle_ca.js`,
        `${dir}/footer.js`,
    ])
        .pipe(concat('mindplot.min.js'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('mindplot', ['mindplot-concat']);

gulp.task('js', ['web2d', 'core-js', 'mindplot']);
